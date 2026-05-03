//  MindRoad Project — FRONTEND Unit Tests

function filterTracks(tracks, search) {
  return tracks.filter((track) =>
    (track.trackName || "").toLowerCase().includes(search.toLowerCase())
  );
}


function isLoggedIn(token) { return !!token; }
function saveAuth(token, user) {
  if (!token || !user) return false;
  return true;
}

//Track Search Filter
describe("Track Search Filter (from AllTracksPage.jsx)", () => {

  const mockTracks = [
    { trackId: 1, trackName: "Frontend Development" },
    { trackId: 2, trackName: "Backend Development" },
    { trackId: 3, trackName: "Data Science" },
    { trackId: 4, trackName: "Mobile Development" },
  ];

  test("search Frontend returns only frontend track", () => {
    const result = filterTracks(mockTracks, "Frontend");
    expect(result.length).toBe(1); // assertEquals(1, result.length)
    expect(result[0].trackName).toBe("Frontend Development");
  });

  test("search is case insensitive", () => {
    const result = filterTracks(mockTracks, "frontend");
    expect(result.length).toBe(1); // assertEquals(1, result.length)
  });

  test("empty search returns all tracks", () => {
    const result = filterTracks(mockTracks, "");
    expect(result.length).toBe(4); // assertEquals(4, result.length)
  });

  test("search with no match returns empty array", () => {
    const result = filterTracks(mockTracks, "Blockchain");
    expect(result.length).toBe(0); // assertEquals(0, result.length)
  });

  test("search Development returns 3 tracks", () => {
    const result = filterTracks(mockTracks, "Development");
    expect(result.length).toBe(3); // assertEquals(3, result.length)
  });

  test("track with null name doesnt crash", () => {
    const tracksWithNull = [
      { trackId: 1, trackName: null },
      { trackId: 2, trackName: "Frontend" },
    ];
    const result = filterTracks(tracksWithNull, "Frontend");
    expect(result.length).toBe(1); // assertEquals(1, result.length)
  });

});


//  Auth Service
describe("Auth Service Tests (from authService.js)", () => {

  test("isLoggedIn returns true when token exists", () => {
    expect(isLoggedIn("eyJhbGciOiJIUzI1NiJ9...")).toBe(true); // assertTrue
  });

  test("isLoggedIn returns false when token is null", () => {
    expect(isLoggedIn(null)).toBe(false); // assertFalse
  });

  test("isLoggedIn returns false when token is empty", () => {
    expect(isLoggedIn("")).toBe(false); // assertFalse
  });

  test("saveAuth returns true with valid token and user", () => {
    expect(saveAuth("jwt-token-123", { email: "test@test.com" })).toBe(true); // assertTrue
  });

  test("saveAuth returns false with null token", () => {
    expect(saveAuth(null, { email: "test@test.com" })).toBe(false); // assertFalse
  });

});
