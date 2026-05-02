using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using MindMapManager.Core.DTOs;
using MindMapManager.Core.Entities;
using MindMapManager.Core.ServiceContracts;
using System.Security.Claims;

namespace MindMapManager.WebAPI.Controllers
{
    [AllowAnonymous]
    //[ApiVersion("1.0")]
    public class AccountController : CustomControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtService jwtService,IConfiguration configuration,IEmailService emailService)
        {
           _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _config = configuration;
            _emailService = emailService;
        }

        /// <summary>
        /// register
        /// </summary>
        /// <param name="registerDTO">register information</param>
        /// <returns>return an access token and a refresh token</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
            {
                string ErrorMassege = 
                    string.Join(" | ",ModelState.Values
                    .SelectMany(v=> v.Errors)
                    .Select(error => error.ErrorMessage));
                return BadRequest(ErrorMassege);
            }
            ApplicationUser appuser = new ApplicationUser();
            appuser.Email = registerDTO.Email;
            appuser.UserName = registerDTO.UserName;
            appuser.FullName = registerDTO.FullName;

            IdentityResult result = await _userManager.CreateAsync(appuser,registerDTO.Password);

            if (!result.Succeeded)
            {
                string errorMessage = string.Join(" | ", result.Errors.Select(error => error.Description));
                return Problem(errorMessage,statusCode: StatusCodes.Status409Conflict);
            }
             
            await _signInManager.SignInAsync(appuser, isPersistent: false);

            await _userManager.AddToRoleAsync(appuser, "Member");

            // create token
            var authRespnse = await _jwtService.CreateJwtTokenAsync(appuser);

            appuser.RefreshToken = authRespnse.RefreshToken;
            appuser.RefreshTokenExpiration = authRespnse.RefreshTokenExpiration;

            appuser.CreatedAt = DateTime.UtcNow;

            await _userManager.UpdateAsync(appuser);
            
            return Ok(authRespnse);
        }

        /// <summary>
        /// login
        /// </summary>
        /// <param name="loginDTO">login information</param>
        /// <returns>return an Access token and a refresh token</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                string errorMessage = string.Join(" | ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));
                return BadRequest(errorMessage);
            }

           
            var signInResult = await _signInManager.PasswordSignInAsync(
                loginDTO.Email,
                loginDTO.Password,
                isPersistent: loginDTO.RememberMe,
                lockoutOnFailure: false
            );

            if (!signInResult.Succeeded)
                return Problem("Invalid Email or Password", statusCode: StatusCodes.Status400BadRequest);

           
            ApplicationUser? appUser = await _userManager.FindByEmailAsync(loginDTO.Email);

            
            var today = DateTime.UtcNow.Date;
            if (!appUser!.LastActDate.HasValue)
            {
                appUser.Streak = 1;
            }
            else
            {
                var daysDiff = (today - appUser.LastActDate.Value.Date).Days;
                if (daysDiff == 1)
                    appUser.Streak += 1;
                else if (daysDiff > 1)
                    appUser.Streak = 1;
                
            }

           
            var authResponse = await _jwtService.CreateJwtTokenAsync(appUser);

          
            appUser.RefreshToken = authResponse.RefreshToken;
            appUser.RefreshTokenExpiration = authResponse.RefreshTokenExpiration;
            appUser.LastActDate = today;

            await _userManager.UpdateAsync(appUser);

            return Ok(authResponse);
        }


        /// <summary>
        /// logout
        /// </summary>
        /// <returns></returns>
        [HttpGet("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            string? email = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            ApplicationUser user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return Unauthorized();

            await _signInManager.SignOutAsync();

            return NoContent();
        }

        /// <summary>
        /// generate a new jwt access token
        /// </summary>
        /// <param name="tokenDTO">expired token and a refresh token</param>
        /// <returns>return new jwt token</returns>
        [HttpPost("generate-new-jwt-token")]
        public async Task<IActionResult> GenerateNewJwtToken(TokenDTO tokenDTO)
        {
            if (tokenDTO == null)
                return BadRequest("invalid client token");

                var principal = _jwtService.GetPrincipaleFromJwtToken(tokenDTO.Token);
                if (principal == null)
                {
                    return BadRequest("Invalid jwt access token");
                }

                string? email = principal.FindFirstValue(ClaimTypes.Email);

                var user = await _userManager.FindByEmailAsync(email);

                if (user == null ||
                    tokenDTO.RefreshToken != user.RefreshToken ||
                    user.RefreshTokenExpiration < DateTime.UtcNow)
                {
                    return BadRequest("Invalid refresh token");
                }

                var authResponse = await _jwtService.CreateJwtTokenAsync(user);

                user.RefreshToken = authResponse.RefreshToken;
                user.RefreshTokenExpiration = authResponse.RefreshTokenExpiration;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    string errorMsg = string.Join(" | ", result.Errors.Select(error => error.Description));
                    return Problem(errorMsg,statusCode: StatusCodes.Status500InternalServerError);
                }

                return Ok(authResponse);
           
        }

        /// <summary>
        /// forgot password
        /// </summary>
        /// <param name="forgotPasswordDTO">must enter a user email and the client base url</param>
        /// <returns>reset password token and user email</returns>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO forgotPasswordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByEmailAsync(forgotPasswordDTO.Email);

            if (user == null)
            {
                return BadRequest("Invalid payload");
            }
            string ResetPasswordToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            
            if (string.IsNullOrEmpty(ResetPasswordToken))
            {
                return BadRequest("Something went wrong");
            }
            var param = new Dictionary<string, string?>()
            {
                {"Token",ResetPasswordToken },
                {"Email", user.Email }
            }; 
            var callbackURL = QueryHelpers.AddQueryString(forgotPasswordDTO.ClientUri,param);

            // send email
            List<EmailAddress> emailAddresses = new List<EmailAddress>();
            emailAddresses.Add(new EmailAddress { DisplayName = user.UserName,Email = user.Email });
            string subject = "Reset your account password";
            string body = $"click here to reset password\n{callbackURL}";
            Message message = new Message(emailAddresses, subject, body);

            await _emailService.SendPaswordResetEmailAsync(message);

            return Ok(new
            {
                token = ResetPasswordToken,
                email = user.Email
            });
        }

        /// <summary>
        /// reset user password
        /// </summary>
        /// <param name="request">it has user email and reset token from forgot password endpoint</param>
        /// <returns></returns>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto request)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return BadRequest("Invalid payload");

            var result = await _userManager.ResetPasswordAsync(user, request.ResetToken, request.Password);

            if (!result.Succeeded)
            {
                var msg = string.Join(" | ", result.Errors.Select(error => error.Description));
                return BadRequest(msg);
            }

            return Ok();

        }

        /// <summary>
        /// check if email already registered or not
        /// </summary>
        /// <param name="email">email to check</param>
        /// <returns>true if email doesn't register and false if email already register</returns>
        [HttpGet("is-email-already-registered")]
        public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
        {
            var RegisterEmail = await _userManager.FindByEmailAsync(email);

            if (RegisterEmail == null)
                return Ok(true);

            return Ok(false);
        }
    }
}
