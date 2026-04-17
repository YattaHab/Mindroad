create database mind_road
go

use mind_road
go

create table [plan] (
	pid int identity(1,1) primary key,
	name nvarchar(100) not null,
	description nvarchar(500),
	price decimal(10,2)
);

create table [user](
	user_id int identity(1,1) primary key,
	username nvarchar(100) not null unique,
	email nvarchar(100) not null unique,
	pass nvarchar(200) not null,
	role nvarchar(50) not null,
	status nvarchar(50) not null,
	streak int default 0,
	last_act_date datetime ,
    reset_pass nvarchar(50),
    reset_pass_expires datetime,
    created_at datetime default getdate() not null,
    pid int
	constraint user_plan_fk foreign key (pid) references [plan](pid)
);
alter table [user] add otp_code int;
alter table [user] add otp_expire datetime;
alter table [user] add is_verified bit;

create table track(
	track_id int identity(1,1) primary key,
	name nvarchar(100) not null, 
	description nvarchar(500),
	icon_url nvarchar(200)
);

create table roadmap(
	rid int identity(1,1) primary key,
	name nvarchar(100) not null,
	description nvarchar(500),
	track_id int,
	constraint track_roadmap_fk foreign key (track_id) references track(track_id)
);

create table [level](
	lid int identity(1,1) primary key,
	name nvarchar(100) not null,
	rid int,
	constraint roadmap_level_fk foreign key (rid) references roadmap(rid)
);

create table topic(
	topic_id int identity(1,1) primary key,
	name nvarchar(100) not null,
	[order] int not null,
	lid int,
	constraint level_topic_fk foreign key (lid) references [level](lid)
);

create table [resource](
	res_id int identity(1,1) primary key,
	name nvarchar(100) not null,
	[order] int not null,
	type nvarchar(100),
	res_url nvarchar(200) not null,
	paid bit default 0,
	topic_id int
	constraint resource_topic_fk foreign key (topic_id) references topic(topic_id)
);
alter table [resource] add constraint res_url_uq unique (res_url);

create table project (
	proj_id int identity(1,1) primary key,
	name nvarchar(100) not null, 
	description nvarchar(500),
	lid int ,
	constraint project_level_fk foreign key (lid) references [level](lid)
);

create table comment (
	com_id int identity(1,1) primary key,
	content nvarchar(1000) not null,
	created_at datetime default getdate() not null,
	topic_id int,
	parent_com_id int,
	constraint topic_comment_fk foreign key (topic_id) references topic(topic_id),
	constraint reply_comment_fk foreign key (parent_com_id) references comment(com_id)
);

create table review (
	rev_id int identity(1,1) primary key,
	content nvarchar(1000),
	rate int not null,
	created_at datetime default getdate() not null,
	user_id int,
	rid int,
	constraint user_review_fk foreign key (user_id) references [user](user_id),
	constraint roadmap_review_fk foreign key (rid) references roadmap(rid),
	constraint user_review_roadmap_uq unique (user_id,rid)
);

create table progress (
	prog_id int identity(1,1) primary key,
	comp_perc decimal(5,2) not null default 0,
	user_id int,
	lid int,
	constraint user_progress_fk foreign key (user_id) references [user](user_id),
	constraint progress_level_fk foreign key (lid) references [level](lid),
	constraint user_progress_level_uq unique (user_id,lid)
);

create table certificate (
	cert_id int identity(1,1) primary key,
	cert_url nvarchar(200) unique,
	user_id int,
	rid int ,
	issued_at datetime  default getdate(),
	constraint user_certificate_fk foreign key (user_id) references [user](user_id),
	constraint certificate_roadmap_fk foreign key (rid) references roadmap(rid),
);

create table notification (
	not_id int identity(1,1) primary key,
	message nvarchar(200) not null,
	[read] bit default 0 not null,
	created_at datetime default getdate() not null,
	ref_id int ,
	ref_type varchar(50),
	user_id int 
	constraint user_notification_fk foreign key (user_id) references [user](user_id),
	
);

create table user_track(
	user_id int ,
	track_id int,
	constraint pk_user_track primary key (user_id , track_id),
	constraint user_tarck_user_fk foreign key (user_id) references [user](user_id),
	constraint user_tarck_track_fk foreign key (track_id) references track(track_id)
);

create table user_comment(
	com_id int primary key ,
	user_id int,
	constraint user_comment_com_fk foreign key (com_id) references comment(com_id),
	constraint user_comment_user_fk foreign key (user_id) references [user](user_id),
);

create table bookmark(
	user_id int,
	res_id int ,
	constraint pk_bookmark primary key(user_id,res_id),
	constraint user_bookmark_fk foreign key (user_id) references [user](user_id),
	constraint res_bookmark_fk foreign key(res_id) references [resource](res_id)
);

create table user_resource (
    user_id int not null foreign key references [user](user_id),
    res_id  int not null foreign key references resource(res_id),
    primary key (user_id, res_id)
);

create table user_project (
    user_id      int not null foreign key references [user](user_id),
    proj_id      int not null foreign key references project(proj_id),
    submitted_at datetime default getdate(),
    primary key  (user_id, proj_id)
);



insert into [plan] (name , description, price) values 
('Free',    'Access to all free roadmaps and resources',          0.00),
('Premium', 'Full access to all roadmaps, resources and projects', 199.99);
GO

insert into [user] (username, email, pass, role, status, streak, last_act_date, reset_pass, reset_pass_expires, created_at, pid) values
('admin',       'admin@mindroad.com',       'hashed_pass_1', 'admin', 'active', 30, '2026-03-07', NULL, NULL, '2023-01-01', 2),

('habiba',		'habiba@gmail.com',          'hashed_pass_2', 'user',  'active', 15, '2026-03-07', NULL, NULL, '2023-03-15', 2),
('toka',		'toka@gmail.com',			 'hashed_pass_3', 'user',  'active', 7,  '2026-03-06', NULL, NULL, '2023-04-20', 2),

('noor',		'noor@outlook.com',			 'hashed_pass_4', 'user',  'active', 0,  '2026-03-05', NULL, NULL, '2023-05-10', 1),
('aya',			'aya@gmail.com',			 'hashed_pass_5', 'user',  'active', 3,  '2026-03-07', NULL, NULL, '2023-06-01', 1),
('baher',		'baher@gmail.com',           'hashed_pass_6', 'user',  'active', 0,  '2026-02-28', NULL, NULL, '2023-07-22', 1),
('eyad',    'eyad@gmail.com',			'hashed_pass_7', 'user',  'banned', 0,  '2026-01-15', NULL, NULL, '2023-08-05', 1),
('karim_cs',    'karim@gmaill.com',         'hashed_pass_8', 'user',  'active', 5,  '2026-03-06', NULL, NULL, '2023-09-18', 1),

('guest_user1', 'guest1@gmail.com',         'hashed_pass_9', 'guest', 'active', 0,  NULL,         NULL, NULL, '2024-01-10', 1),
('guest_user2', 'guest2@gmail.com',         'hashed_pass_10','guest', 'active', 0,  NULL,         NULL, NULL, '2024-02-20', 1);
GO


----------------------------------------------------------------------------------data engineering track---------------------------------------------------------------------------------------------------------
--track_id = 1
insert into track(name , description) values 
('Data Engineering',
'Master the art of building data pipelines, warehouses, and big data systems. From SQL fundamentals to cloud-scale data engineering.'
);
go

insert into roadmap(name , description,track_id) values 
('Data Engineering Roadmap',
 'A complete roadmap to become a Data Engineer. Covers Relational Databases, SQL, Python, ETL, Data Warehousing, NoSQL, Cloud Computing, and Big Data.',
 1);
 go 
 --rid = 1
 insert into level (name , rid) values 
('Beginner',     1),
('Intermediate', 1),
('Advanced',     1);
go

insert into topic (name , [order],lid) values
--beginner level
('Relational Database',        1, 1),
('SQL',                        2, 1),
('Problem Solving Using SQL',  3, 1),
('Python Basics',              4, 1),
('Python Problem Solving',     5, 1),
('Databases in Python',        6, 1),
('Python Libraries',           7, 1),
--intermediate level
('Data Warehouse',    1, 2),
('ETL using SSIS',    2, 2),
('ETL using Python',  3, 2),
('NoSQL - MongoDB',   4, 2),
('Dashboards',        5, 2),
('Linux',             6, 2),
('Snowflake',         7, 2),
('DBT',               8, 2),
--advanced level
('Cloud Computing - Azure', 1, 3),
('Orchestration - Airflow', 2, 3),
('Vector Database',         3, 3),
('Containerization',        4, 3),
('Big Data',                5, 3);
GO

insert into project (name , description , lid) values
('Beginner Data Engineering Project',
 'Build a relational database schema, write complex SQL queries, and create a Python script to clean and manipulate a real dataset using Pandas and NumPy.',
 1),
('Intermediate Data Engineering Project',
 'Design and implement a Data Warehouse with a star schema. Build an ETL pipeline using SSIS and Python to extract data from multiple sources, transform it, and load it into the warehouse. Create a Power BI dashboard to visualize the results.',
 2),
('Advanced Data Engineering Project',
 'Build an end-to-end data pipeline on Azure Cloud. Use Apache Airflow to orchestrate the pipeline, implement big data processing with Apache Spark, containerize the solution with Docker, and deploy it to the cloud.',
 3);
go

 insert into resource (name , res_url , type , [order], paid,topic_id) values
 --topic 01
('SQL Server - Eng. Ramy',
 'https://www.youtube.com/playlist?list=PLSGEGD0dbMKrvd5ppnyFLm7q3xEH97T-t',
 'video', 1, 0, 1),
('MaharaTech - Relational Database',
 'https://maharatech.gov.eg/course/view.php?id=740',
 'course', 2, 0, 1),
('DataCamp - Introduction to Relational Databases',
 'https://app.datacamp.com/learn/courses/introduction-to-relational-databases-in-sql',
 'course', 3, 1, 1),
('DataCamp - Database Design',
 'https://app.datacamp.com/learn/courses/database-design',
 'course', 4, 1, 1),
('Building with Databases',
 'https://www.youtube.com/playlist?list=PLE8kQVoC67Py5LnCUHp_wp2uzbaBZWSmx',
 'video', 5, 0, 1),
('Relational Database Internals',
 'https://www.youtube.com/playlist?list=PLE8kQVoC67PzGwMMsSk3C8MvfAqcYjusF',
 'video', 6, 0, 1),
('CMU - Database Systems (Advanced)',
 'https://www.youtube.com/playlist?list=PLSE8ODhjZXjbj8BMuIrRcacnQh20hmY9g',
 'video', 7, 0, 1);
 go

insert into resource (name, res_url, type, [order], paid, topic_id) values
--topic 02
('Big Data - SQL بالعربي',
 'https://www.youtube.com/watch?v=kb-_GbpH3sQ',
 'video', 1, 0, 2),
('FreeCodeCamp - SQL Full Course',
 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
 'video', 2, 0, 2),
('Eng. Mohamed Eldesouki - SQL',
 'https://www.youtube.com/playlist?list=PL1DUmTEdeA6J6oDLTveTt4Z7E5qEfFluE',
 'video', 3, 0, 2),

 --topic 03
 ('HackerRank - SQL Challenges',
 'https://www.hackerrank.com/domains/sql',
 'docs', 1, 0, 3),
('LeetCode - Top SQL 50',
 'https://leetcode.com/studyplan/top-sql-50/',
 'docs', 2, 0, 3),
('DataLemur - SQL Interview Questions',
 'https://datalemur.com/',
 'docs', 3, 0, 3),

 --topic 04
 ('Udacity - Introduction to Python',
 'https://www.udacity.com/course/introduction-to-python--ud1110',
 'course', 1, 1, 4),
('Big Data - Python بالعربي Part 1',
 'https://www.youtube.com/watch?v=XKQaCF_Om8o',
 'video', 2, 0, 4),
('Big Data - Python بالعربي Part 2',
 'https://www.youtube.com/watch?v=mlbe7Vxr7yA',
 'video', 3, 0, 4),
('Coursera - Python for Everybody',
 'https://www.coursera.org/learn/python',
 'course', 4, 1, 4),
('DataCamp - Intro to Python for Data Science',
 'https://app.datacamp.com/learn/courses/intro-to-python-for-data-science',
 'course', 5, 0, 4),

 --topic 05
 ('HackerRank - Python Challenges',
 'https://www.hackerrank.com/domains/python',
 'docs', 1, 0, 5),

 --topic 06
 ('DataCamp - Introduction to Importing Data in Python',
 'https://app.datacamp.com/learn/courses/introduction-to-importing-data-in-python',
 'course', 1, 0, 6),
('DataCamp - Introduction to Relational Databases in Python',
 'https://app.datacamp.com/learn/courses/introduction-to-relational-databases-in-python',
 'course', 2, 0, 6),

 --topic 07
 ('FreeCodeCamp - NumPy',
 'https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS',
 'video', 1, 0, 7),
('DataCamp - Introduction to NumPy',
 'https://app.datacamp.com/learn/courses/introduction-to-numpy',
 'course', 2, 1, 7),
('Corey Schafer - Pandas',
 'https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS',
 'video', 3, 0, 7),
('Kaggle - Pandas',
 'https://www.kaggle.com/learn/pandas',
 'course', 4, 0, 7),
('DataCamp - Data Manipulation with Pandas',
 'https://app.datacamp.com/learn/courses/data-manipulation-with-pandas',
 'course', 5, 1, 7),
('DataCamp - Joining Data with Pandas',
 'https://app.datacamp.com/learn/courses/joining-data-with-pandas',
 'course', 6, 1, 7),
('LeetCode - 30 Days of Pandas',
 'https://leetcode.com/studyplan/30-days-of-pandas/',
 'docs', 7, 0, 7),

 --topic 08
 ('Garage Education - Data Warehouse (1-40)',
 'https://www.youtube.com/playlist?list=PLxNoJq6k39G_m6DYjpz-V92DkaQEiXxkF',
 'video', 1, 0, 8),
('Implementing Data Warehouse',
 'https://www.youtube.com/playlist?list=PL1565idytjOTwGN63vZK7lNK6pVXpGo3s',
 'video', 2, 0, 8),
('DataCamp - Data Warehousing Concepts',
 'https://app.datacamp.com/learn/courses/data-warehousing-concepts',
 'course', 3, 1, 8),
('Udemy - Data Warehouse The Ultimate Guide',
 'https://www.udemy.com/course/data-warehouse-the-ultimate-guide/',
 'course', 4, 1, 8),
('Data With Baraa - Data Warehouse',
 'https://youtu.be/9GVqKuTVANE',
 'video', 5, 0, 8),
('The Data Warehouse Toolkit - Chapters 1-5',
 'https://www.oreilly.com/library/view/the-data-warehouse/9781118530801/',
 'book', 6, 1, 8),

 --topic 09
 ('WiseOwl - SSIS Tutorials',
 'https://www.youtube.com/playlist?list=PLNIs-AWhQzcmPg_uV2BZi_KRG4LKs6cRs',
 'video', 1, 0, 9),
('Eng. Ahmed Elrefaey - SSIS',
 'https://www.youtube.com/playlist?list=PLgOQg5m1pmp84jmXHGNWWYuU3m4bNCmfs',
 'video', 2, 0, 9),
('SSIS Project 1',
 'https://www.youtube.com/playlist?list=PLcAbhg_RWLaLUaYpAAvOLu2hlyVgZlRjb',
 'video', 3, 0, 9),
('SSIS Project 2',
 'https://www.youtube.com/watch?v=eNxbMwUGl1g',
 'video', 4, 0, 9),

 --topic 10
 ('DataCamp - Introduction to Importing Data in Python',
 'https://app.datacamp.com/learn/courses/introduction-to-importing-data-in-python',
 'course', 1, 1, 10),
('DataCamp - Intermediate Importing Data in Python',
 'https://app.datacamp.com/learn/courses/intermediate-importing-data-in-python',
 'course', 2, 1, 10),
('DataCamp - Cleaning Data in Python',
 'https://app.datacamp.com/learn/courses/cleaning-data-in-python',
 'course', 3, 1, 10),
('DataCamp - Streamlined Data Ingestion with Pandas',
 'https://app.datacamp.com/learn/courses/streamlined-data-ingestion-with-pandas',
 'course', 4, 1, 10),
('DataCamp - ETL and ELT in Python',
 'https://app.datacamp.com/learn/courses/etl-and-elt-in-python',
 'course', 5, 1, 10)
 ;
GO

insert into resource (name , res_url , type , [order], paid,topic_id) values
--topic 11
('Bro Code - MongoDB Full Course',
 'https://www.youtube.com/watch?v=c2M-rlkkT5o',
 'video', 1, 0, 11),
('DataCamp - NoSQL Concepts',
 'https://app.datacamp.com/learn/courses/nosql-concepts',
 'course', 2, 1, 11),
('DataCamp - Introduction to MongoDB in Python',
 'https://app.datacamp.com/learn/courses/introduction-to-using-mongodb-for-data-science-with-python',
 'course', 3, 1, 11),
('Net Ninja - MongoDB Tutorial',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA',
 'video', 4, 0, 11),

 --topic 12
('Udemy - Microsoft Power BI',
 'https://www.udemy.com/course/microsoft-power-bi-up-running-with-power-bi-desktop/',
 'course', 1, 1, 12),
('Zanoon Lab - Power BI',
 'https://www.youtube.com/playlist?list=PL69umUTzySPGWMxnmhX9SV5PIEbdnHv63',
 'video', 2, 0, 12),
('Learnit - Power BI',
 'https://www.youtube.com/playlist?list=PLoyECfvEFOjaMKFbBSKSmnOpEcXqqRegW',
 'video', 3, 0, 12),
('Coursera - Data Visualization with Tableau',
 'https://www.coursera.org/specializations/data-visualization',
 'course', 4, 1, 12),
('Udemy - Tableau Desktop',
 'https://www.udemy.com/course/up-running-with-tableau-desktop/',
 'course', 5, 1, 12),

 --topic 13
('Big Data - Linux بالعربي',
 'https://www.youtube.com/watch?v=gojeTqXdBH0',
 'video', 1, 0, 13),
('DataCamp - Introduction to Shell',
 'https://app.datacamp.com/learn/courses/introduction-to-shell',
 'course', 2, 1, 13),
('DataCamp - Introduction to Bash Scripting',
 'https://app.datacamp.com/learn/courses/introduction-to-bash-scripting',
 'course', 3, 1, 13),
('DataCamp - Data Processing in Shell',
 'https://app.datacamp.com/learn/courses/data-processing-in-shell',
 'course', 4, 1, 13),
('Arab Linux Community (Advanced)',
 'https://www.youtube.com/playlist?list=PLy1Fx2HfcmWBpD_PI4AQpjeDK5-5q6TG7',
 'video', 5, 0, 13),
('HackerRank - Shell Challenges',
 'https://www.hackerrank.com/domains/shell',
 'docs', 6, 0, 13),

--topic 14
('Udemy - Snowflake Masterclass',
 'https://www.udemy.com/course/snowflake-masterclass/',
 'course', 1, 1, 14),
('DataCamp - Introduction to Snowflake',
 'https://app.datacamp.com/learn/courses/introduction-to-snowflake',
 'course', 2, 1, 14),
('DataCamp - Introduction to Data Modeling in Snowflake',
 'https://app.datacamp.com/learn/courses/introduction-to-data-modeling-in-snowflake',
 'course', 3, 1, 14),

 --topic 15
('Kahan Data Solutions - DBT',
 'https://www.youtube.com/playlist?list=PLy4OcwImJzBLJzLYxpxaPUmCWp8j1esvT',
 'video', 1, 0, 15),
('DataCamp - Introduction to DBT',
 'https://app.datacamp.com/learn/courses/introduction-to-dbt',
 'course', 2, 1, 15),
('Fundamentals of Data Engineering - Book',
 'https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/',
 'book', 3, 1, 15),

 --topic 16
('DataCamp - Understanding Cloud Computing',
 'https://app.datacamp.com/learn/courses/understanding-cloud-computing',
 'course', 1, 1, 16),
('Tybul - Microsoft Azure Data Engineering',
 'https://www.youtube.com/playlist?list=PLuQSde7Xvu7DCRenR1otgxAplTtnzKO9e',
 'video', 2, 0, 16),
('Coursera - Microsoft Azure Data Engineering (DP-203)',
 'https://www.coursera.org/professional-certificates/microsoft-azure-dp-203-data-engineering',
 'course', 3, 1, 16),
('DataCamp - Microsoft Azure Fundamentals AZ-900',
 'https://app.datacamp.com/learn/skill-tracks/microsoft-azure-fundamentals-az-900',
 'course', 4, 1, 16),

 --topic 17
('Coursera - ETL and Data Pipelines with Shell, Airflow and Kafka',
 'https://www.coursera.org/learn/etl-and-data-pipelines-shell-airflow-kafka',
 'course', 1, 1, 17),
('Udemy - Apache Airflow Hands-On',
 'https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/',
 'course', 2, 1, 17),
('Airflow Tutorial for Beginners',
 'https://www.youtube.com/watch?v=K9AnJ9_ZAXE',
 'video', 3, 0, 17),
('DataCamp - Introduction to Apache Airflow in Python',
 'https://app.datacamp.com/learn/courses/introduction-to-apache-airflow-in-python',
 'course', 4, 1, 17),

 --topic 18
('IBM Coursera - Vector Database Fundamentals',
 'https://www.coursera.org/specializations/vector-database-fundamentals',
 'course', 1, 1, 18),
('DataCamp - Working with the OpenAI API',
 'https://app.datacamp.com/learn/courses/working-with-the-openai-api',
 'course', 2, 1, 18),
('DataCamp - Introduction to Embeddings with the OpenAI API',
 'https://app.datacamp.com/learn/courses/introduction-to-embeddings-with-the-openai-api',
 'course', 3, 1, 18),
('DataCamp - Vector Databases for Embeddings with Pinecone',
 'https://app.datacamp.com/learn/courses/vector-databases-for-embeddings-with-pinecone',
 'course', 4, 1, 18),

 --topic 19
('Udemy - Docker & Kubernetes Practical Guide',
 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/',
 'course', 1, 1, 19),
('Big Data - Docker بالعربي',
 'https://www.youtube.com/watch?v=PrusdhS2lmo',
 'video', 2, 0, 19),

 --topic 20
('Big Data - Hadoop بالعربي',
 'https://www.youtube.com/playlist?list=PLrooD4hY1QqAK5pbBpcthLuMa-cXnXJLE',
 'video', 1, 0, 20),
('Garage Education - Introduction to Distributed Systems (Hadoop)',
 'https://www.youtube.com/watch?v=Ot63tlh0PaE',
 'video', 2, 0, 20),
('DataCamp - Big Data with PySpark',
 'https://app.datacamp.com/learn/skill-tracks/big-data-with-pyspark',
 'course', 3, 1, 20),
('Garage Education - Apache Spark',
 'https://www.youtube.com/playlist?list=PLxNoJq6k39G9lTU9A65HwC0uWD-XkqqOi',
 'video', 4, 0, 20),
('Udemy - Apache Spark with Python',
 'https://www.udemy.com/course/apache-spark-programming-in-python-for-beginners/',
 'course', 5, 1, 20),
('Udacity - Spark',
 'https://bit.ly/3sYKFUZ',
 'course', 6, 1, 20),
('Learning Spark 2nd Edition - Book',
 'https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/',
 'book', 7, 1, 20)
 ;
GO


---------------------------------------------------------------------------------backend track------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--track_id = 2
insert into track (name , description ) values
('Backend',
 'Master server-side development. Build APIs, work with databases, handle authentication and deploy production-ready applications.'
 );
 go

 -------------------------------------------------------------------------------backend node.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--rid =2
 insert into roadmap (name , description , track_id) values
 ('Node.js',
 'A complete roadmap to become a Node.js backend developer. Covers JavaScript, Node.js, Express, MongoDB, REST APIs, Authentication, SQL, WebSockets, GraphQL and Design Patterns.',
 2);
go

insert into level (name , rid) values 
('Beginner',     2),
('Intermediate', 2),
('Advanced',     2);
GO

insert into topic (name , [order], lid) values 
-- Beginner (lid = 4)
('Web Fundamentals & Git',     1, 4),
('JavaScript Fundamentals',    2, 4),
('Node.js & HTTP Module',      3, 4),
('Express.js & MongoDB',       4, 4),
-- Intermediate (lid = 5)
('TypeScript & MVC Architecture',         1, 5),
('Authentication, Sessions & File Uploads', 2, 5),
('REST APIs & JWT',                        3, 5),
('OAuth2, API Security & Emails',          4, 5),
('Unit Testing, Documentation & Deployment', 5, 5),
-- Advanced (lid = 6)
('SQL Databases & ORMs',               1, 6),
('WebSockets, Socket.io & WebRTC',     2, 6),
('GraphQL, Caching & Task Scheduling', 3, 6),
('Design Patterns & Microservices',    4, 6);
go

insert into project (name,description, lid) values
('URL Shortener',
 'Build a URL Shortener web application using Express and MongoDB. The user enters a long URL and the app generates a short URL which auto-redirects to the target website. Previously shortened URLs are listed on the homepage.',
 4),
('Task Grading Hub',
 'Build a Task Grading Hub REST API using JWT Authentication. Students can register and upload tasks as PDF files. Only the admin can add new tasks and assign grades. Implement server-side validation, API documentation with Swagger, and unit tests.',
 5),
('Online Marketplace',
 'Build an Online Marketplace platform using GraphQL API with Apollo Server, real-time communication between buyers and sellers using Socket.IO, and PayPal Integration. Implement JWT authentication, server-side validation, API documentation and unit tests.',
 6);
go


insert into resource (name, res_url, type, [order], paid, topic_id) values
--topic 1
('Abdelrahman Gamal - HTML Crash Course',
 'https://www.youtube.com/watch?v=q3yFo-t1ykw',
 'video', 1, 0, 21),
('Abdelrahman Gamal - CSS Crash Course',
 'https://www.youtube.com/watch?v=Z-5QVutAEW4',
 'video', 2, 0, 21),
('The Net Ninja - HTML & CSS Crash Course',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9ivBf_eKCPIAYXWzLlPAm6G',
 'video', 3, 0, 21),
('Big Data Arabic - Git & GitHub',
 'https://www.youtube.com/watch?v=Q6G-J54vgKc',
 'video', 4, 0, 21),
('freeCodeCamp - Git & GitHub',
 'https://www.youtube.com/watch?v=RGOj5yH7evk',
 'video', 5, 0, 21),
('Network Direction - Network Fundamentals',
 'https://www.youtube.com/playlist?list=PLCy5RQkQgvf4yaL-AMDO8rpAAi90sWfGl',
 'video', 6, 0, 21),
('ByteByteGo - DNS Server',
 'https://www.youtube.com/watch?v=27r4Bzuj5NQ',
 'video', 7, 0, 21),
('JobStack - SQL vs NoSQL Databases',
 'https://www.youtube.com/watch?v=WWazrq7ZC8E',
 'video', 8, 0, 21),

 --topic 2
('Elzero Web School - JavaScript Full Course',
 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv',
 'video', 1, 0, 22),
('The Net Ninja - JavaScript',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9haFPT7J25Q9GRB_ZkFrQAc',
 'video', 2, 0, 22),
('Web Dev Simplified - Destructuring',
 'https://www.youtube.com/watch?v=NIq3qLaHCIs',
 'video', 3, 0, 22),
('Traversy Media - Array Higher Order Functions',
 'https://www.youtube.com/watch?v=rRgD1yVwIvE',
 'video', 4, 0, 22),
('The Net Ninja - OOP in JavaScript',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9i5yvDkJgt60vNVWffpblB7',
 'video', 5, 0, 22),
('The Net Ninja - Async JavaScript, JSON & APIs',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jx2TTZk3IGWKSbtugYdrlu',
 'video', 6, 0, 22),
('Web Dev Simplified - JavaScript Closures',
 'https://www.youtube.com/watch?v=aHrvi2zTlaU',
 'video', 7, 0, 22),

 --topic 3
('Codezone - Node.js Introduction',
 'https://www.youtube.com/playlist?list=PLQtNtS-WfRa8OF9juY3k6WUWayMfDKHK2',
 'video', 1, 0, 23),
('KMR Script - Node.js Basics',
 'https://www.youtube.com/playlist?list=PLL2zWZTDFZzgxxD66mv95I8hC0pby5bdp',
 'video', 2, 0, 23),
('The Net Ninja - Node.js Crash Course',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU',
 'video', 3, 0, 23),
('Academind - Node.js',
 'https://www.youtube.com/playlist?list=PL55RiY5tL51oGJorjEgl6NVeDbx_fO5jR',
 'video', 4, 0, 23),
('Dave Gray - Node.js',
 'https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw',
 'video', 5, 0, 23),

 --topic 4
('KMR Script - Express & Mongoose',
 'https://www.youtube.com/playlist?list=PLL2zWZTDFZzgxxD66mv95I8hC0pby5bdp',
 'video', 1, 0, 24),
('The Net Ninja - Express.js & Mongoose',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU',
 'video', 2, 0, 24),
('Academind - Express.js & Mongoose',
 'https://www.youtube.com/playlist?list=PL55RiY5tL51oGJorjEgl6NVeDbx_fO5jR',
 'video', 3, 0, 24),
('The Net Ninja - MongoDB Tutorial',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA',
 'video', 4, 0, 24),
('Academind - MongoDB Full Tutorial',
 'https://www.youtube.com/watch?v=VELru-FCWDM',
 'video', 5, 0, 24),
('Dave Gray - MongoDB & Mongoose',
 'https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw',
 'video', 6, 0, 24),

 --topic 5
('Elzero Web School - TypeScript',
 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ',
 'video', 1, 0, 25),
('The Net Ninja - TypeScript',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI',
 'video', 2, 0, 25),
('Youssef Abbas - TypeScript with Express',
 'https://www.youtube.com/watch?v=N17Tef8gh-Q',
 'video', 3, 0, 25),
('Colt Steele - TypeScript with Express',
 'https://www.youtube.com/watch?v=qy8PxD3alWw',
 'video', 4, 0, 25),
('VivaCode - MVC in Express',
 'https://www.youtube.com/watch?v=yIhRWW9vB5s',
 'video', 5, 0, 25),
('PedroTech - MVC in Express',
 'https://www.youtube.com/watch?v=Cgvopu9zg8Y',
 'video', 6, 0, 25),
('Code with Fadi - express-validator',
 'https://www.youtube.com/watch?v=9DQuFEar2og',
 'video', 7, 0, 25),

 --topic 6 
('Youssef Abbas - File Upload',
 'https://www.youtube.com/watch?v=j9ibqDLmKZs',
 'video', 1, 0, 26),
('PedroTech - File Uploads',
 'https://www.youtube.com/watch?v=wIOpe8S2Mk8',
 'video', 2, 0, 26),
('KMR Script - Session-Based Authentication',
 'https://www.youtube.com/playlist?list=PLL2zWZTDFZzgxxD66mv95I8hC0pby5bdp',
 'video', 3, 0, 26),
('WittCode - Sessions in Node.js',
 'https://www.youtube.com/watch?v=IPAvfcodcI8',
 'video', 4, 0, 26),
('Sam Meech-Ward - Bcrypt in Node.js',
 'https://www.youtube.com/watch?v=AzA_LTDoFqY',
 'video', 5, 0, 26),
('Index Academy - Advanced MongoDB Queries',
 'https://www.youtube.com/playlist?list=PLDQ11FgmbqQNFuGQTKbAIGEyOKWUGBs6i',
 'video', 6, 0, 26),

 --topic 7
('Codezone - REST APIs & JWT Authentication',
 'https://www.youtube.com/playlist?list=PLQtNtS-WfRa8OF9juY3k6WUWayMfDKHK2',
 'video', 1, 0, 27),
('Web Dev Simplified - REST APIs with Express',
 'https://www.youtube.com/watch?v=fgTGADljAeg',
 'video', 2, 0, 27),
('Web Dev Simplified - JWT Part 1',
 'https://www.youtube.com/watch?v=7Q17ubqLfaM',
 'video', 3, 0, 27),
('Web Dev Simplified - JWT Part 2',
 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
 'video', 4, 0, 27),
('Academind - Ecommerce REST API',
 'https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q',
 'video', 5, 0, 27),
('TomDoesTech - Ecommerce API with TypeScript',
 'https://www.youtube.com/watch?v=BWUi6BS9T5Y',
 'video', 6, 0, 27),

 --topic 8
('Almadrasa - OAuth 2.0 Intro & Workflow',
 'https://www.youtube.com/watch?v=86qNjL7I00w',
 'video', 1, 0, 28),
('The Net Ninja - OAuth2.0 Strategies',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x',
 'video', 2, 0, 28),
('Ahmed Elemam - API Security',
 'https://www.youtube.com/watch?v=a0g8rI4j4qc',
 'video', 3, 0, 28),
('freeCodeCamp - API Security',
 'https://www.youtube.com/watch?v=YYe0FdfdgDU',
 'video', 4, 0, 28),
('Youssef Abbas - Rate Limiting',
 'https://www.youtube.com/watch?v=g2GUBz-Trls',
 'video', 5, 0, 28),
('DeepWave Technology - SMTP',
 'https://www.youtube.com/watch?v=W3xCWR5WjvY',
 'video', 6, 0, 28),
('Traversy Media - Sending Emails in Node.js',
 'https://www.youtube.com/watch?v=nF9g1825mwk',
 'video', 7, 0, 28),
('AyyazTech - Sending SMS with Twilio',
 'https://www.youtube.com/watch?v=vs4in-UFdX0',
 'video', 8, 0, 28),

 --topic 9
('Tresmerge - Unit Testing Full Course',
 'https://www.youtube.com/playlist?list=PLzNfs-3kBUJllCa8_6pLYDMnIlg6Lfvu4',
 'video', 1, 0, 29),
('Web Dev Simplified - Unit Testing in JavaScript',
 'https://www.youtube.com/watch?v=FgnxcUQ5vho',
 'video', 2, 0, 29),
('Anson the Developer - Unit Testing in Express',
 'https://www.youtube.com/watch?v=t5sFkGk8GY8',
 'video', 3, 0, 29),
('Mohamed Essa - Swagger.io API Documentation',
 'https://www.youtube.com/playlist?list=PLMYF6NkLrdN_CelwcY-B9PPi4UsXmU8Ka',
 'video', 4, 0, 29),
('Skills With Arif - Swagger Integration with Express',
 'https://www.youtube.com/watch?v=dhMlXoTD3mQ',
 'video', 5, 0, 29),
('Rahat WebDev - Deployment on Railway',
 'https://www.youtube.com/watch?v=4Ga4c_amvY8',
 'video', 6, 0, 29),

 --topic 10
('Big Data Arabic - MySQL Full Course',
 'https://www.youtube.com/watch?v=kb-_GbpH3sQ',
 'video', 1, 0, 30),
('freeCodeCamp - MySQL Full Course',
 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
 'video', 2, 0, 30),
('Kevin Stratvert - SQL Server Crash Course',
 'https://www.youtube.com/watch?v=h0nxCDiD-zg',
 'video', 3, 0, 30),
('pragma - Database Migrations',
 'https://www.youtube.com/watch?v=TmVRKDoMulE',
 'video', 4, 0, 30),
('Web Dev Simplified - Prisma ORM',
 'https://www.youtube.com/watch?v=RebA5J-rlwg',
 'video', 5, 0, 30),
('WittCode - Sequelize ORM',
 'https://www.youtube.com/playlist?list=PLkqiWyX-_Lov8qmMOVn4SEQwr9yOjNn3f',
 'video', 6, 0, 30),
('Laith Academy - TypeORM',
 'https://www.youtube.com/watch?v=JaTbzPcyiOE',
 'video', 7, 0, 30),
('Traversy Media - MySQL inside Node.js',
 'https://www.youtube.com/watch?v=EN6Dx22cPRI',
 'video', 8, 0, 30),

 --topic 11
('Codezone - Socket.io',
 'https://www.youtube.com/watch?v=IUfCXmQwm1w',
 'video', 1, 0, 31),
('Dave Gray - Socket.io',
 'https://www.youtube.com/playlist?list=PL0Zuz27SZ-6NOkbTDxKi7grs_oxJhLu07',
 'video', 2, 0, 31),
('Web Dev Simplified - Socket.io',
 'https://www.youtube.com/watch?v=ZKEqqIO7n-k',
 'video', 3, 0, 31),
('Web Dev Simplified - Video & Audio Streaming WebRTC',
 'https://www.youtube.com/watch?v=DvlyzDZDEq4',
 'video', 4, 0, 31),
('Mafia Codes - Chat Application',
 'https://www.youtube.com/playlist?list=PLdHg5T0SNpN09AlLBAYahKZUrAWsIL7No',
 'video', 5, 0, 31),
('Traversy Media - Chat Application',
 'https://www.youtube.com/watch?v=jD7FnbI76Hg',
 'video', 6, 0, 31),


 --topic 12 
('EgyptJS - GraphQL',
 'https://www.youtube.com/watch?v=2QxM1UDwOMw',
 'video', 1, 0, 32),
('The Net Ninja - GraphQL',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUxtblNUahcsg0WLxmrK_y',
 'video', 2, 0, 32),
('Web Dev Simplified - GraphQL',
 'https://www.youtube.com/watch?v=ZQL7tL2S0oQ',
 'video', 3, 0, 32),
('JobStack - Scaling App with Caching Strategies',
 'https://www.youtube.com/watch?v=XP32O_gMZkA',
 'video', 4, 0, 32),
('Web Dev Simplified - Redis Crash Course',
 'https://www.youtube.com/watch?v=jgpVdJB2sKQ',
 'video', 5, 0, 32),
('Traversy Media - Redis in Node.js',
 'https://www.youtube.com/watch?v=oaJq1mQ3dFI',
 'video', 6, 0, 32),
('Web Dev Simplified - PayPal Integration',
 'https://www.youtube.com/watch?v=DNM9FdFrI1k',
 'video', 7, 0, 32),
('Web Dev Simplified - Stripe Integration',
 'https://www.youtube.com/watch?v=mI_-1tbIXQI',
 'video', 8, 0, 32),
('Raddy - Task Scheduling with node-schedule',
 'https://www.youtube.com/watch?v=Ezv30i47sDs',
 'video', 9, 0, 32),

 --topic 13
('Passionate Coders - Creational Design Patterns',
 'https://www.youtube.com/playlist?list=PLNE3WjwctlOznMzwM4hlMIXBw2Bf6zWc4',
 'video', 1, 0, 33),
('DevGeeks Academy - Design Patterns Full',
 'https://www.youtube.com/playlist?list=PLd-dOEgzBpGnt3GuEszo_piQq52XSqAmj',
 'video', 2, 0, 33),
('Mohamed Reda - Structural Design Patterns',
 'https://www.youtube.com/playlist?list=PLnqAlQ9hFYdcW3viz_oXRal_FNkg2Dssm',
 'video', 3, 0, 33),
('Tresmerge - Web Scraping with Puppeteer',
 'https://www.youtube.com/watch?v=gh7TmUcku8M',
 'video', 4, 0, 33),
('Traversy Media - Web Scraping with Puppeteer',
 'https://www.youtube.com/watch?v=S67gyqnYHmI',
 'video', 5, 0, 33)
 ;
GO

--------------------------------------------------------------------------------------------backend .net framework------------------------------------------------------------------------------------------------------

-- rid = 3
insert into roadmap (name, description, track_id) values
('ASP.NET Core',
 'A complete roadmap to become an ASP.NET Core backend developer. Covers C#, OOP, SOLID, SQL, EF Core, MVC, REST APIs, Authentication, Design Patterns, Clean Architecture and Advanced .NET topics.',
 2);
go

insert into level (name, rid) values
('Beginner',     3),
('Intermediate', 3),
('Advanced',     3);
go
-- lid = 7 (Beginner), 8 (Intermediate), 9 (Advanced)

insert into topic (name, [order], lid) values
-- Beginner (lid = 7)
('Web Fundamentals, HTML, CSS, Git & Bootstrap',  1, 7),
('C# Basics & OOP',                               2, 7),
('Generics, Collections, Delegates & Events',     3, 7),
('Async Programming, Records & Attributes',       4, 7),
('SOLID Principles',                              5, 7),
('SQL Fundamentals',                              6, 7),
('LINQ & Entity Framework Core',                  7, 7),
-- Intermediate (lid = 8)
('Design Patterns',                               1, 8),
('ASP.NET MVC & Identity',                        2, 8),
('REST API Development',                          3, 8),
('Repository Pattern, Identity & JWT',            4, 8),
('JWT Refresh Tokens, API Versioning & Unit Testing', 5, 8),
-- Advanced (lid = 9)
('Background Jobs, Cancellation Token & Docker',  1, 9),
('Caching, SignalR & Advanced EF Core',           2, 9),
('Configuration, Logging, HttpClient & Result Pattern', 3, 9),
('Pagination, AutoMapper, Rate Limiting & Specification Pattern', 4, 9),
('Clean Architecture & Vertical Slice Architecture', 5, 9);
go

insert into project (name, description, lid) values
('C# Console Application',
 'Build a console application using C# that demonstrates OOP principles, SOLID principles, generics, collections, LINQ queries and async programming. Connect to SQL Server using Entity Framework Core.',
 7),
('ASP.NET MVC Web Application',
 'Build a full MVC web application with ASP.NET Core. Implement CRUD operations, authentication and authorization using Identity, JWT tokens, repository pattern, and unit tests. Document your API using Swagger.',
 8),
('Production-Ready ASP.NET Core API',
 'Build a production-ready REST API with Clean Architecture. Implement caching with Redis, real-time communication with SignalR, background jobs, Docker containerization, pagination, filtering, AutoMapper, and proper logging.',
 9);
go

insert into resource (name, res_url, type, [order], paid, topic_id) values

--topic 1
('Codegraphia - كيف تصبح ASP.NET Full Stack Developer',
 'https://youtu.be/oRzjtOJGvWA',
 'video', 1, 0, 34),
('Abdelrahman Gamal - HTML Crash Course',
 'https://www.youtube.com/watch?v=q3yFo-t1ykw',
 'video', 2, 0, 34),
('Abdelrahman Gamal - CSS Crash Course',
 'https://www.youtube.com/watch?v=Z-5QVutAEW4',
 'video', 3, 0, 34),
('Elzero Web School - Chrome Dev Tools',
 'https://www.youtube.com/watch?v=_IKTGQosYMo',
 'video', 4, 0, 34),
('The Net Ninja - HTML & CSS Crash Course',
 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9ivBf_eKCPIAYXWzLlPAm6G',
 'video', 5, 0, 34),
('Koding 101 - Chrome Dev Tools',
 'https://www.youtube.com/watch?v=fxplz32rgEQ',
 'video', 6, 0, 34),
('Issam Abdelnabi - Git & GitHub',
 'https://www.youtube.com/watch?v=Jaqrcw_MB9E',
 'video', 7, 0, 34),
('Abdelrahman Gamal - Bootstrap',
 'https://www.youtube.com/watch?v=EzHbZjXDdKc',
 'video', 8, 0, 34),
('اكاديمية ترميز - Bootstrap',
 'https://www.youtube.com/watch?v=65EFKUpYk2A',
 'video', 9, 0, 34),
('Traversy Media - JavaScript Crash Course',
 'https://youtu.be/hdI2bqOjy3c',
 'video', 10, 0, 34),
('freeCodeCamp - Git & GitHub',
 'https://www.youtube.com/watch?v=RGOj5yH7evk',
 'video', 11, 0, 34),
('Backend Concepts Overview',
 'https://www.youtube.com/playlist?list=PLVMqeUndPM9-ydOUDMGP9bUhaMTt_728Y',
 'video', 12, 0, 34),

--topic 2
('Piece of Cake Dev - C# Basics',
 'https://youtube.com/playlist?list=PLfHpC6JZ316dbrFn-jAwMBZwMqkcAabWB',
 'video', 1, 0, 35),
('Passionate Coders - C# Basics',
 'https://youtube.com/playlist?list=PLsV97AQt78NT0H8J71qe7edwRpAirfqOI',
 'video', 2, 0, 35),
('Issam Abdelnabi - C# Basics & OOP',
 'https://youtube.com/playlist?list=PL4n1Qos4Tb6SWPbJNpiznp-Ok4A8J_23l',
 'video', 3, 0, 35),
('Caleb Curry - C# Full Course',
 'https://youtube.com/playlist?list=PL_c9BZzLwBRIXCJGLd4UzqH34uCclOFwC',
 'video', 4, 0, 35),
('Piece of Cake Dev - OOP',
 'https://youtube.com/playlist?list=PLfHpC6JZ316f6YXKyux0dHjJXA0Kg38p7',
 'video', 5, 0, 35),
('Passionate Coders - OOP',
 'https://youtube.com/playlist?list=PLsV97AQt78NQumtM4rQc77yjbkZcGOTX5',
 'video', 6, 0, 35),

--topic 3
('Piece of Cake Dev - Generics',
 'https://youtube.com/playlist?list=PLfHpC6JZ316ciHMql4eXK1zfzuttajevf',
 'video', 1, 0, 36),
('Issam Abdelnabi - Generics',
 'https://youtu.be/xE6bS6EfKAc',
 'video', 2, 0, 36),
('Naresh i Technologies - Generics & Collections',
 'https://youtube.com/playlist?list=PLVlQHNRLflP8DCUdve6NEAfu8T6M9127i',
 'video', 3, 0, 36),
('Passionate Coders - Delegates & Events',
 'https://youtube.com/playlist?list=PLsV97AQt78NQYhO7NqlBTrJX_Nsk3SmyY',
 'video', 4, 0, 36),
('Piece of Cake Dev - Delegates & Events',
 'https://youtube.com/playlist?list=PLfHpC6JZ316dwb3MN8W6XuBuyaTA8RVaW',
 'video', 5, 0, 36),
('Rainer Stropek - Delegates & Events',
 'https://youtu.be/nhJ63BnlP5I',
 'video', 6, 0, 36),

--topic 4
('Kudvenkat Arabic - Async Programming',
 'https://youtu.be/xX_V6rgVa0Q',
 'video', 1, 0, 37),
('Rainer Stropek - Async Programming',
 'https://youtu.be/FIZVKteEFyk',
 'video', 2, 0, 37),
('Tural Suleymani - Async Programming',
 'https://youtu.be/_fPNcQrB1JA',
 'video', 3, 0, 37),
('Metigator - Records in C#',
 'https://youtu.be/N2qewr8yeuI',
 'video', 4, 0, 37),
('Metigator - Nulls in C#',
 'https://youtu.be/6-AdjwK43hM',
 'video', 5, 0, 37),
('Metigator - Attributes in C#',
 'https://youtu.be/UkGF0SJzDN4',
 'video', 6, 0, 37),

--topic 5
('Passionate Coders - SOLID Principles',
 'https://youtube.com/playlist?list=PLsV97AQt78NRT1GmH2EJ-o-2_ILFM9feq',
 'video', 1, 0, 38),
('Issam Abdelnabi - SOLID Principles',
 'https://youtube.com/playlist?list=PL4n1Qos4Tb6ThSyydEJTm7xJ3qEwE8Oyu',
 'video', 2, 0, 38),
('Omar Ahmed - SOLID Principles',
 'https://youtube.com/playlist?list=PLwWuxCLlF_uevri_OpofVLXkRRFnZ7TSV',
 'video', 3, 0, 38),
('Geekific - SOLID Principles',
 'https://youtu.be/HoA6aZPR5K0',
 'video', 4, 0, 38),

--topic 6
('Mohamed El Desouki - SQL Full Course',
 'https://youtube.com/playlist?list=PL1DUmTEdeA6J6oDLTveTt4Z7E5qEfFluE',
 'video', 1, 0, 39),
('catch Error - SQL',
 'https://youtube.com/playlist?list=PLAowHBw9BCw5b56-SfY7tgndHbGcQycp2',
 'video', 2, 0, 39),
('kudvenkat - SQL',
 'https://youtube.com/playlist?list=PL08903FB7ACA1C2FB',
 'video', 3, 0, 39),

--topic 7
('Issam Abdelnabi - LINQ',
 'https://youtube.com/playlist?list=PL4n1Qos4Tb6Sj1Y4xJuJoWCuqleeG2yt6',
 'video', 1, 0, 40),
('Naresh i Technologies - LINQ',
 'https://youtube.com/playlist?list=PLVlQHNRLflP_-XQtkI8-EJagXRzqf7mgG',
 'video', 2, 0, 40),
('Metigator - EF Core',
 'https://youtube.com/playlist?list=PL4n1Qos4Tb6QZkbTWJx7wHqEABP8Pg6uv',
 'video', 3, 0, 40),
('DevCreed - EF Core',
 'https://youtube.com/playlist?list=PL62tSREI9C-cHV28v-EqWinveTTAos8Pp',
 'video', 4, 0, 40),
('Coding Tutorials - EF Core',
 'https://youtube.com/playlist?list=PLQB-TSatJvw4T7mQneItRgsemyjMMYRNk',
 'video', 5, 0, 40),
('Geekific - EF Core',
 'https://youtu.be/TS5i-uPXLs8',
 'video', 6, 0, 40),

--topic 8
('Passionate Coders - Design Patterns',
 'https://youtube.com/playlist?list=PLsV97AQt78NTrqUAZM562JbR3ljX19JFR',
 'video', 1, 0, 41),
('Issam Abdelnabi - Design Patterns',
 'https://www.youtube.com/watch?v=8OitfyFqboA&list=PL4n1Qos4Tb6STYkwXrOdYxj_dlGqzozZN',
 'video', 2, 0, 41),
('Geekific - Design Patterns',
 'https://youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc',
 'video', 3, 0, 41),
('freeCodeCamp - Design Patterns',
 'https://youtu.be/rylaiB2uH2A',
 'video', 4, 0, 41),

--topic 9
('Coding-Future - ASP.NET MVC',
 'https://www.youtube.com/playlist?list=PLPZvv4Sjz6uHtXszCb132o7Oe_T_ur2FP',
 'video', 1, 0, 42),
('Codographia - ASP.NET MVC',
 'https://youtube.com/playlist?list=PLX1bW_GeBRhAjpkPCTpKXJoFGe2ZpYGUC',
 'video', 2, 0, 42),
('Teddy Smith - ASP.NET MVC',
 'https://youtube.com/playlist?list=PL82C6-O4XrHde_urqhKJHH-HTUfTK6siO',
 'video', 3, 0, 42),
('kudvenkat - ASP.NET MVC',
 'https://youtube.com/playlist?list=PL6n9fhu94yhVm6S8I2xd6nYz2ZORd7X2v',
 'video', 4, 0, 42),
('DotNetMastery - ASP.NET MVC',
 'https://youtu.be/hZ1DASYd9rk',
 'video', 5, 0, 42),

--topic 10
('Passionate Coders - REST API',
 'https://youtube.com/playlist?list=PLsV97AQt78NQ8E7cEqovH0zLYRJgJahGh',
 'video', 1, 0, 43),

--topic 11
('DevCreed - Repository Pattern',
 'https://www.youtube.com/playlist?list=PL62tSREI9C-e6nQ47brLj00iSGddiee73',
 'video', 1, 0, 44),
('ITI - Identity (Day 9 part 2 & 3)',
 'https://drive.google.com/drive/u/0/folders/1CazlYIq1Y36xHU-BYuvJ9w4HPk6CCECX',
 'docs', 2, 0, 44),
('DevCreed - Identity & JWT Tokens',
 'https://youtube.com/playlist?list=PL62tSREI9C-eYNE1Pyw0yv1tETs5V8WGd',
 'video', 3, 0, 44),
('Teddy Smith - JWT',
 'https://youtube.com/playlist?list=PL82C6-O4XrHcjpGzpxAVqumv2PaYGIJfz',
 'video', 4, 0, 44),

--topic 12
('DevCreed - JWT Refresh Tokens',
 'https://www.youtube.com/playlist?list=PL62tSREI9C-foV0zXVpW_f0JNtTD6Wv2W',
 'video', 1, 0, 45),
('Code Maze - JWT Refresh Tokens Part 1',
 'https://youtu.be/i6kkKBsHEJs',
 'video', 2, 0, 45),
('Code Maze - JWT Refresh Tokens Part 2',
 'https://youtu.be/lml_j5ujjeQ',
 'video', 3, 0, 45),
('Milan Jovanović - API Versioning',
 'https://youtu.be/F9j3X6KuIpw',
 'video', 4, 0, 45),
('Issam Abdelnabi - Unit Testing',
 'https://www.youtube.com/watch?v=dowaRZIJRKE&list=PL4n1Qos4Tb6RrQpmpGWALaE1PVvWR8d3A',
 'video', 5, 0, 45),
('Teddy Smith - Unit Testing',
 'https://www.youtube.com/playlist?list=PL82C6-O4XrHeyeJcI5xrywgpfbrqdkQd4',
 'video', 6, 0, 45),
('Raw Coding - Unit Testing',
 'https://www.youtube.com/playlist?list=PLOeFnOV9YBa4Q1a7V5jWTGG9RSpKMYTpK',
 'video', 7, 0, 45),

--topic 13
('Advanced Level Intro - Things You Must Know',
 'https://youtu.be/V3ZPPPKEipA',
 'video', 1, 0, 46),
('DevCreed - Background Jobs',
 'https://youtube.com/playlist?list=PL62tSREI9C-ccQuNXXAty3Vfxi0QcqCJP',
 'video', 2, 0, 46),
('Rahul Nath - Background Jobs',
 'https://youtu.be/39gIPekzpjs',
 'video', 3, 0, 46),
('IAmTimCorey - Cancellation Token',
 'https://youtu.be/ip3Z4ZcAgA8',
 'video', 4, 0, 46),
('Codegraphia - Docker',
 'https://www.youtube.com/playlist?list=PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ',
 'video', 5, 0, 46),
('Julio Casal - Docker',
 'https://youtu.be/cWMztQwIQNs',
 'video', 6, 0, 46),

--topic 14
('tutorialsEU - Caching in ASP.NET Core',
 'https://youtu.be/MSUTojuUEX4',
 'video', 1, 0, 47),
('Milan Jovanović - Caching Part 1',
 'https://youtu.be/Tt5zIKVMMbs',
 'video', 2, 0, 47),
('Milan Jovanović - Caching Part 2',
 'https://youtu.be/MQ96krIOjs4',
 'video', 3, 0, 47),
('Milan Jovanović - Caching Part 3',
 'https://youtu.be/BMXgJxSaDSo',
 'video', 4, 0, 47),
('Ahmed Mohamady - SignalR',
 'https://www.udemy.com/course/realtime-application-with-signalr-arabic/',
 'course', 5, 1, 47),
('Raw Coding - SignalR',
 'https://www.youtube.com/playlist?list=PLOeFnOV9YBa7nzzuXnThdfsyY06AuCP5V',
 'video', 6, 0, 47),
('Milan Jovanović - SignalR Part 1',
 'https://youtu.be/Oiepl-LLfIs',
 'video', 7, 0, 47),
('Milan Jovanović - SignalR Part 2',
 'https://youtu.be/DTfqqe7NgMQ',
 'video', 8, 0, 47),
('Milan Jovanović - SignalR Part 3',
 'https://youtu.be/A7eO2QpTqoE',
 'video', 9, 0, 47),
('Code It Up AMBITIONED - Advanced EF Core',
 'https://youtube.com/playlist?list=PLLGdqRi7N09Yv1kSFXi40dnEAJriaE8nJ',
 'video', 10, 0, 47),

--topic15
('Rahul Nath - Configuration in ASP.NET Core',
 'https://youtu.be/5GlgHV_12-k',
 'video', 1, 0, 48),
('IAmTimCorey - Structured Logging',
 'https://youtu.be/_iryZxv8Rxw',
 'video', 2, 0, 48),
('Rahul Nath - Options Pattern',
 'https://youtu.be/SizJCLcjbOA',
 'video', 3, 0, 48),
('Felipe Gavilan - HttpClient',
 'https://youtube.com/playlist?list=PLiG4KxH00ZpnmuSsIrQ3IGTUUfl_Gl1AH',
 'video', 4, 0, 48),
('huzcodes - Broker with External Services',
 'https://youtu.be/MLBdUmDixw8',
 'video', 5, 0, 48),
('Result Pattern - Medium Article',
 'https://medium.com/@wgyxxbf/result-pattern-a01729f42f8c',
 'article', 6, 0, 48),

--topic 16
('Pagination, Filtration & Sorting',
 'https://youtu.be/X8zRvXbirMU',
 'video', 1, 0, 49),
('Mapster',
 'https://youtu.be/UIslFVEHkzA',
 'video', 2, 0, 49),
('Code Maze - Mapster',
 'https://www.youtube.com/watch?v=Wf7F57TTQsU',
 'video', 3, 0, 49),
('AutoMapper Template',
 'https://youtu.be/87fhsf8gfDg',
 'video', 4, 0, 49),
('AutoMapper - Notion Docs',
 'https://www.notion.so/af906e5017314d808aa8a169087c2ba8',
 'docs', 5, 0, 49),
('Rate Limiting in ASP.NET Core',
 'https://www.youtube.com/watch?v=bOfOo3Zsfx0',
 'video', 6, 0, 49),
('Specification Pattern',
 'https://www.youtube.com/watch?v=bEyBtpnCqVY',
 'video', 7, 0, 49),
('FastEndpoints',
 'https://www.youtube.com/watch?v=oqNu0xavAyc',
 'video', 8, 0, 49),
('Benchmark in .NET',
 'https://www.youtube.com/playlist?list=PLMwkkoLA3KE8fkxP1-nKtCJeUV3g5yF9K',
 'video', 9, 0, 49),

--topic 17
('Code Future - Clean Architecture',
 'https://www.youtube.com/playlist?list=PLPZvv4Sjz6uECy67jbHG7QtM2nCylp4YR',
 'video', 1, 0, 50),
('Milan Jovanović - Clean Architecture',
 'https://www.youtube.com/playlist?list=PLYpjLpq5ZDGstQ5afRz-34o_0dexr1RGa',
 'video', 2, 0, 50),
('Milan Jovanović - Vertical Slice Architecture',
 'https://youtu.be/dQdXHRkePr8',
 'video', 3, 0, 50),
('Milan Jovanović - Vertical Slice vs Clean Architecture',
 'https://youtu.be/Az4Z0HJYl-U',
 'video', 4, 0, 50),
('Code Maze - Architecture in .NET',
 'https://www.youtube.com/playlist?list=PLkOmPTFOxKBo_uI0AfU2S1J6Tx5R3J08J',
 'video', 5, 0, 50)
;
go

---------------------------------------------------------------------------------------------------------------------diff tracks with roadmaps------------------------------------------------------------------------------------------------------------------------------

insert into track (name , description ) values 
('Frontend' ,'Master client-side development. Build beautiful, responsive and interactive web applications that deliver great user experiences.'),
('Data Science & AI','Master data analysis, machine learning and artificial intelligence. Turn raw data into powerful insights and build intelligent systems that learn from data.'),
('Mobile Development','Build native and cross-platform mobile applications for iOS and Android. Learn UI design principles, state management, API integration and app deployment to the App Store and Google Play.'),
('DevOps','Master the tools and practices that bridge development and operations. Automate software delivery, manage infrastructure, containerize applications and deploy to the cloud with confidence.');
go
select * from track

insert into roadmap (name,description,track_id) values 
('React.js','A complete roadmap to master React.js. Build modern, fast and scalable frontend applications using components, hooks, state management and React ecosystem tools.', 3),
('Vue.js','A complete roadmap to master Vue.js. Build elegant and performant frontend applications using Vue components, Vuex, Vue Router and the Vue ecosystem.',3),
('Python for Data Science','A complete roadmap to master Python for Data Science. From Python basics to data analysis, data visualization and working with real-world datasets using Pandas, NumPy and Matplotlib.',4),
('Machine Learning','A complete roadmap to master Machine Learning. From fundamentals and statistics to supervised learning, unsupervised learning, model evaluation and deploying real-world ML models using Scikit-learn and TensorFlow.',4),
('React Native ','Build cross-platform iOS and Android apps using JavaScript and React. Covers components, navigation, device APIs, AsyncStorage, REST API integration and publishing to app stores.',5),
('Flutter','Build beautiful cross-platform apps using Dart and Flutter. Covers widgets, state management, navigation, Firebase integration, animations and deployment to both iOS and Android.',5),
('Docker & Kubernetes','Learn containerization from the ground up. Build Docker images, manage multi-container apps with Docker Compose, orchestrate production workloads with Kubernetes and deploy scalable microservices.',6),
('CI/CD & Cloud','Master continuous integration and delivery pipelines using GitHub Actions and Jenkins. Deploy and manage cloud infrastructure on AWS or Azure with a focus on automation, monitoring and reliability.',6)
;

insert into level (name, rid) values
('Beginner',     4),('Intermediate', 4),('Advanced',     4),
('Beginner',     5),('Intermediate', 5),('Advanced',     5),
('Beginner',     6),('Intermediate', 6),('Advanced',     6),
('Beginner',     7),('Intermediate', 7),('Advanced',     7),
('Beginner',     8),('Intermediate', 8),('Advanced',     8),
('Beginner',     9),('Intermediate', 9),('Advanced',     9),
('Beginner',     10),('Intermediate', 10),('Advanced',     10),
('Beginner',     11),('Intermediate', 11),('Advanced',     11);
go
select * from level
-- =============================================
-- INSERT: user_track
-- =============================================
insert into user_track (user_id, track_id) values
-- habiba: Data Engineering + Backend
(2, 1),
(2, 2),
-- toka: Data Science & AI + Data Engineering
(3, 1),
(3, 4),
-- noor: Backend + Frontend
(4, 2),
(4, 3),
-- aya: Frontend
(5, 3),
-- baher: Backend
(6, 2),
-- karim_cs: Mobile Development
(8, 5),
-- guest_user1: Frontend
(9, 3),
-- guest_user2: Data Science & AI
(10, 4);
go

-- =============================================
-- INSERT: progress
-- =============================================
-- habiba: completed Data Engineering Beginner & Intermediate, in progress Advanced
-- also started Node.js Beginner
insert into progress (comp_perc, user_id, lid) values
(100.00, 2, 1),
(100.00, 2, 2),
(60.00,  2, 3),
(40.00,  2, 4),
-- toka: completed Data Engineering Beginner, in progress Intermediate
(100.00, 3, 1),
(50.00,  3, 2),
-- noor: in progress Node.js Beginner + React.js Beginner
(30.00,  4, 4),
(20.00,  4, 10),
-- aya: in progress React.js Beginner
(45.00,  5, 10),
-- baher: just started Node.js Beginner
(10.00,  6, 4),
-- karim_cs: in progress React Native Beginner
(25.00,  8, 22);
go

-- =============================================
-- INSERT: certificate
-- =============================================
-- habiba earned a certificate for completing Data Engineering
-- (all 3 levels done = certificate awarded)
insert into [certificate] (cert_url, issued_at, user_id, rid) values
('https://mindroad.com/certificates/habiba-data-engineering.pdf',
 '2026-02-15', 2, 1);
go

insert into comment (content, created_at, topic_id, parent_com_id) values
-- comments on topic 1 (Relational Database)
(N'This topic gave me a solid foundation in database design. The ERD resources are excellent!',
 '2026-01-10 10:30:00', 1, NULL),

(N'Agreed! I would also recommend practicing with real datasets after finishing these videos.',
 '2026-01-10 14:45:00', 1, 1),

(N'Can someone explain the difference between 2NF and 3NF? Still a bit confused.',
 '2026-01-11 09:15:00', 1, NULL),

(N'Sure! 2NF removes partial dependencies while 3NF removes transitive dependencies. Check the Elmasri book referenced in the resources.',
 '2026-01-11 11:00:00', 1, 3),

-- comments on topic 2 (SQL)
(N'The Big Data Arabic SQL course is a masterpiece. Highly recommend starting with it.',
 '2026-01-20 08:00:00', 2, NULL),

(N'I finished the SQL topic in 2 weeks. The problem solving section really helped solidify everything.',
 '2026-01-22 16:30:00', 2, NULL),

-- comments on topic 4 (Python Basics)
(N'Is there any difference between these Python courses or should I just pick one?',
 '2026-02-01 12:00:00', 4, NULL),

(N'Pick the Arabic one if you prefer Arabic, otherwise CS Dojo is beginner friendly. Both cover the same topics.',
 '2026-02-01 13:30:00', 4, 7),

-- comments on topic 22 (JavaScript Fundamentals - Node.js roadmap)
(N'Elzero Web School JavaScript course is the best Arabic resource I have ever used.',
 '2026-02-10 10:00:00', 22, NULL),

(N'Make sure to practice closures and async/await well before moving to Node.js. It will save you a lot of confusion later.',
 '2026-02-11 09:00:00', 22, NULL);
go
-- com_id 1-10

-- =============================================
-- INSERT: user_comment
-- =============================================
insert into user_comment (user_id, com_id) values
(2, 1),   -- habiba wrote comment 1
(3, 2),   -- toka wrote comment 2
(4, 3),   -- noor wrote comment 3
(2, 4),   -- habiba replied on comment 3
(3, 5),   -- toka wrote comment 5
(5, 6),   -- aya wrote comment 6
(6, 7),   -- baher wrote comment 7
(2, 8),   -- habiba replied on comment 7
(4, 9),   -- noor wrote comment 9
(5, 10);  -- aya wrote comment 10
go

-- =============================================
-- INSERT: review
-- =============================================
insert into review (content, rate, created_at, user_id, rid) values
-- reviews on Data Engineering roadmap (rid=1)
(N'This roadmap completely changed my career. The structure is perfect and the resources are hand-picked and high quality.',
 5, '2026-02-16 10:00:00', 2, 1),

(N'Great roadmap! Covers everything you need to become a data engineer. Took me around 6 months to complete.',
 5, '2026-02-20 14:00:00', 3, 1),

(N'Very well structured. I wish there were more advanced cloud resources but overall excellent.',
 4, '2026-02-25 09:30:00', 4, 1),

-- reviews on Node.js roadmap (rid=2)
(N'The best Node.js roadmap I have found. Goes from zero to production-ready APIs step by step.',
 5, '2026-02-28 11:00:00', 4, 2),

(N'Good roadmap but some topics feel a bit rushed. Would love more resources on microservices.',
 4, '2026-03-01 08:00:00', 6, 2),

-- reviews on ASP.NET Core roadmap (rid=3)
(N'As a .NET developer this roadmap is gold. Passionate Coders and DevCreed resources are top tier.',
 5, '2026-03-02 15:00:00', 2, 3),

-- reviews on React.js roadmap (rid=4)
(N'Just started but the beginner section is already very clear and well organized.',
 5, '2026-03-05 10:00:00', 5, 4),

(N'Solid roadmap. Would be better with more project ideas but the resources are great.',
 4, '2026-03-06 12:00:00', 9, 4);
go

-- =============================================
-- INSERT: bookmark
-- =============================================
insert into bookmark (user_id, res_id) values
-- habiba bookmarked resources from Data Engineering roadmap
(2, 1),
(2, 5),
(2, 15),
(2, 30),
-- toka bookmarked resources
(3, 1),
(3, 10),
(3, 25),
-- noor bookmarked resources from Node.js roadmap
(4, 72),
(4, 78),
(4, 85),
-- aya bookmarked resources
(5, 72),
(5, 80),
-- baher bookmarked resources
(6, 72),
(6, 73),
-- karim_cs bookmarked resources
(8, 50),
(8, 55);
go

-- =============================================
-- INSERT: notification
-- =============================================
insert into notification (message, [read], created_at, ref_id, ref_type, user_id) values
-- habiba notifications
(N'Congratulations! You completed the Data Engineering Beginner level.', 1, '2026-01-20 10:00:00', 1,  'level',    2),
(N'Congratulations! You completed the Data Engineering Intermediate level.', 1, '2026-02-10 14:00:00', 2, 'level',   2),
(N'You earned a certificate for completing the Data Engineering roadmap!',   1, '2026-02-15 09:00:00', 1, 'roadmap',  2),
(N'Someone replied to your comment.',                                        1, '2026-01-10 15:00:00', 1, 'comment',  2),
(N'New resources have been added to the Python Libraries topic.',            0, '2026-03-01 08:00:00', 7, 'topic',    2),

-- toka notifications
(N'Congratulations! You completed the Data Engineering Beginner level.',     1, '2026-02-01 11:00:00', 1, 'level',    3),
(N'Someone replied to your comment.',                                        0, '2026-02-01 14:00:00', 7, 'comment',  3),
(N'New resources have been added to the ETL using Python topic.',            0, '2026-03-02 09:00:00', 9, 'topic',    3),

-- noor notifications
(N'Welcome to MindRoad! Start your learning journey today.',                 1, '2023-05-10 08:00:00', NULL, NULL,   4),
(N'You have a new reply on your comment.',                                   0, '2026-01-11 11:30:00', 3,  'comment', 4),

-- aya notifications
(N'Welcome to MindRoad! Start your learning journey today.',                 1, '2023-06-01 08:00:00', NULL, NULL,   5),
(N'New resources have been added to the React.js Beginner level.',           0, '2026-03-05 10:00:00', 10, 'level',  5),

-- baher notifications
(N'Welcome to MindRoad! Start your learning journey today.',                 1, '2023-07-22 08:00:00', NULL, NULL,   6),

-- karim_cs notifications
(N'Welcome to MindRoad! Start your learning journey today.',                 1, '2023-09-18 08:00:00', NULL, NULL,   8),
(N'New resources have been added to the React Native Beginner level.',       0, '2026-03-06 10:00:00', 22, 'level',  8);
go

select * from bookmark

select username  , r.name  as resource_name
from bookmark b
join [user] u on b.user_id = u.user_id
join resource r on b.res_id = r.res_id


-----------------------------------------------------------------------------------------------------------------------procedures-----------------------------------------------------------------------------
create procedure register_user
	@username varchar(50),
	@email varchar(250),
	@password_hash varchar(250)
as 
begin
	set nocount on;
	begin try
		
		--validate username and email
		if @username is null or LTRIM(rtrim(@username)) = ''
		begin
			raiserror('Username cannot be empty.',16,1);
			return;
		end
		if @email is null or LTRIM(rtrim(@email)) = ''
		begin
			raiserror('Email cannot be empty.',16,1);
			return;
		end

		--valiate email format
		if @email not like '%_@_%._%'
		begin
			raiserror('Invalid email format.',16,1);
			return;
		end

		-- Validate password is hashed
        if @password_hash is null or len(@password_hash) < 60
        begin
            raiserror('Password does not appear to be hashed.', 16, 1);
            return;
        end

		--check duplicate username or email
		if exists (select 1 from [user] where username = @username)
		begin
			raiserror('Username already exists',16,1);
			return;
		end
		if exists (select 1 from [user] where email = @email)
		begin
			raiserror('Email already exists',16,1);
			return;
		end
			
		--insert user info into DB
		begin transaction;
		insert into [user] (username , email , pass, role , status , pid) values
		(@username , @email , @password_hash , 'user','active', 1);

		--welocoming notification
		declare @new_user_id int = scope_identity();
		insert into notification (message , ref_id , ref_type , user_id) values 
		('Welcome to MindRoad! Start your learning journey today.' , null , null, @new_user_id);

		commit transaction;
	end try
	begin catch 
		if @@TRANCOUNT > 0
			rollback transaction;
		throw;
	end catch
end
go

-----------------------------------------------------------------------------test register_user proc----------------------------------
exec register_user
    @username      = 'youssef',
    @email         = 'youssef@gmail.com',
    @password_hash = '$2a$12$eImiTXuWVxfM37uY4JANjQ==hashed_pass_here';

exec register_user
    @username      = 'youssef',
    @email         = 'youssef@gmail.com',
    @password_hash = '$2a$12$eImiTXuWVxfM37uY4JANjQuu9zpLMbwSmKJNlyPsoAolMDPF9AAES';

exec register_user
    @username      = 'someone',
    @email         = 'youssef@gmail.com',
    @password_hash = '$2a$12$eImiTXuWVxfM37uY4uuuuuuuuuuuuuuuuuuuuuuuuuJANjQ==hashed_pass_here';

exec register_user
    @username      = 'youssef2',
    @email         = 'notanemail',
    @password_hash = '$2a$12$eImiTXuWVxfM3uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu7uY4JANjQ==hashed_pass_here';


create procedure enroll_user 
	@userId int ,
	@roadmapId int
as
begin
	set nocount on;
	begin try
	if exists (select 1 from [user] where user_id = @userId and role = 'guest')
begin
    raiserror('Guests are not allowed to perform this action.', 16, 1);
    return;
end
	--check if user is not banned
	if exists (select 1 from [user] where user_id = @userId and status = 'banned')
	begin
		raiserror('User is banned.',16,1);
		return;
	end

	--check not already enrolled
	if exists ( select 1 from progress p 
				join level l on p.lid = l.lid
				where p.user_id = @userId 
				and l.rid = @roadmapId )
	begin
        raiserror('User is already enrolled in this roadmap.', 16, 1);
        return;
    end

	-- get track_id and beginner lid for this roadmap
	declare @track_id  int ;
	declare @beginner_lid int;

	select @track_id = track_id from roadmap
	where rid = @roadmapId;

	select @beginner_lid = lid from [level] 
	where level.rid = @roadmapId
	and level.name = 'beginner';

	begin transaction;

	--insert new uer_track row if not enrolled in the same track before)
	if not exists (select 1 from user_track where user_id = @userId 
					and track_id = @track_id)
	begin
		insert into user_track (user_id , track_id) values
		(@userId , @track_id)
	end

	--create progress row for beginner level
	insert into progress (user_id , lid) values
	(@userId , @beginner_lid)

	 -- Send notification
     declare @roadmap_name nvarchar(100);
     select @roadmap_name = name from roadmap where rid = @roadmapId;

     insert into notification (message,ref_id, ref_type, user_id)
     values ('You have enrolled in ' + @roadmap_name + '! Start your journey today.',@roadmapId, 'roadmap', @userId);

     commit transaction;
	end try

	begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go
-----------------------------------------------------------------test enroll_user proc--------------------------------------------	
exec enroll_user @userId = 4, @roadmapId = 2;
exec enroll_user @userId = 4, @roadmapId = 3;
exec enroll_user @userId = 4, @roadmapId = 2;
exec enroll_user @userId = 7, @roadmapId = 2;


create procedure send_notification 
	@userId int,
	@message nvarchar(500),
	@ref_id int = null,
	@ref_type varchar(100) = null
as 
begin
	set nocount on;

	insert into notification(message, ref_id,ref_type,user_id) values
	(@message, @ref_id ,@ref_type,@userId);
end
go


create procedure award_certificate 
	@user_id int,
	@roadmap_id int
as
begin
	set nocount on;
	begin try
		if exists (select 1 from certificate where user_id = @user_id and rid = @roadmap_id)
		begin
			raiserror ('user already had this certificate' , 16 , 1);
			return;
		end

		declare @roadmap_name nvarchar(500);
		select @roadmap_name = roadmap.name from roadmap 
		where rid = @roadmap_id;
		declare @msg nvarchar(500);
		set @msg = 'Congratulations! You completed the ' + @roadmap_name + ' roadmap and earned a certificate!';


		begin transaction;

		insert into [certificate] (cert_url , user_id , rid) values
		( null, @user_id , @roadmap_id)

		exec send_notification 
			@userId = @user_id,
			@message = @msg,
			@ref_id = @roadmap_id,
			@ref_type = 'roadmap';

		commit transaction;
	end try
	begin catch
		if @@TRANCOUNT > 0
			rollback transaction;
		throw;
	end catch
end
go

select * from progress
create procedure mark_resource_done
	@user_id int,
	@res_id int
as
begin
	set nocount on;
	begin try 
		if exists (select 1 from [user] where user_id = @user_id and role = 'guest')
		begin
		    raiserror('Guests are not allowed to perform this action.', 16, 1);
		    return;
		end
		
		declare @topic_id int;
		declare @lid int;
		declare @rid int;

		--get all info about resource to use later
		select @topic_id = r.topic_id , @lid = t.lid , @rid = l.rid
		from resource r 
		join topic t on r.topic_id = t.topic_id
		join level l on t.lid = l.lid 
		where r.res_id = @res_id;

		--chaeck if user in enrolled in this roadmap
		if not exists (select 1 from progress where user_id = @user_id and lid = @lid)
		begin
            raiserror('User is not enrolled in this roadmap.', 16, 1);
            return;
        end

		-- check if resource is already marked 
		if exists (select 1 from user_resource where user_id = @user_id and res_id = @res_id)
		begin
            raiserror('Resouce already marked as done.', 16, 1);
            return;
        end

		begin transaction;

		--mark resource as done
		insert into user_resource (user_id, res_id) values
		(@user_id , @res_id);

		--modifiying completed percentage
		declare @done_topics int;
		declare @total_topics int;
		declare @comp_perc  decimal(5,2);

		select @done_topics = count(distinct r.topic_id)
		from user_resource ur
		join resource r on ur.res_id = r.res_id
		join topic t on r.topic_id = t.topic_id
		where ur.user_id =@user_id and t.lid = @lid;

		select @total_topics = count(*) from topic where lid = @lid;

		set @comp_perc = (@done_topics * 100.0) / @total_topics;

		update progress set comp_perc = @comp_perc where user_id = @user_id and lid = @lid;


	    -- Check if this topic just completed (first resource done in this topic)
        declare @topic_done int;
	    
        select @topic_done = count(*)
        from user_resource ur
        join resource r on ur.res_id = r.res_id
        where ur.user_id = @user_id
        and r.topic_id = @topic_id;
	    
        if @topic_done = 1
        begin
            declare @topic_msg nvarchar(500);
            set @topic_msg = 'You completed a topic! Keep going.';
	    
            exec send_notification
                @userId   = @user_id,
                @message  = @topic_msg,
                @ref_id   = @topic_id,
                @ref_type = 'topic';
		end

		-- Resource done notification
        declare @res_msg nvarchar(500);
        set @res_msg = 'You completed a resource! Keep going.';

        exec send_notification
            @userId   = @user_id,
            @message  = @res_msg,
            @ref_id   = @res_id,
            @ref_type = 'resource';

        commit transaction;
	end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go

------------------------------------------------------------------------------test mark_resource_done------------------------------
exec mark_resource_done @user_id = 4, @res_id = 93;
exec mark_resource_done @user_id = 4, @res_id = 94;
exec mark_resource_done @user_id = 4, @res_id = 93;
exec mark_resource_done @user_id = 4, @res_id = 1;

select * from user_resource where user_id = 4;
select * from progress      where user_id = 4;
select * from notification  where user_id = 4;

create procedure submit_project
    @user_id int,
    @proj_id int
as
begin
    set nocount on;

    begin try
		if exists (select 1 from [user] where user_id = @user_id and role = 'guest')
		begin
		    raiserror('Guests are not allowed to perform this action.', 16, 1);
		    return;
		end
        -- Get lid and rid from proj_id
        declare @lid int;
        declare @rid int;

        select @lid = p.lid, @rid = l.rid
        from project p
        join level l on p.lid = l.lid
        where p.proj_id = @proj_id;

        -- Check user is enrolled
        if not exists (select 1 from progress where user_id = @user_id and lid = @lid)
        begin
            raiserror('User is not enrolled in this roadmap.', 16, 1);
            return;
        end

        -- Check project not already submitted
        if exists (select 1 from user_project where user_id = @user_id and proj_id = @proj_id)
        begin
            raiserror('Project already submitted.', 16, 1);
            return;
        end

        begin transaction;

            -- Submit project
            insert into user_project (user_id, proj_id)
            values (@user_id, @proj_id);

            -- Send level completion notification
            declare @level_msg nvarchar(500);
            set @level_msg = 'Project submitted successfully! You have completed this level.';

            exec send_notification
                @userId   = @user_id,
                @message  = @level_msg,
                @ref_id   = @lid,
                @ref_type = 'level';

            -- Check if next level exists
            declare @next_lid int;

            select top 1 @next_lid = lid
            from level
            where rid = @rid
            and lid > @lid
            order by lid asc;

            if @next_lid is not null
            begin
                -- Unlock next level
                insert into progress (user_id, lid)
                values (@user_id, @next_lid);

                declare @unlock_msg nvarchar(500);
                set @unlock_msg = 'Next level unlocked! Keep going.';

                exec send_notification
                    @userId   = @user_id,
                    @message  = @unlock_msg,
                    @ref_id   = @next_lid,
                    @ref_type = 'level';
            end
            else
            begin
                -- No next level = roadmap complete = award certificate
                exec award_certificate
                    @user_id    = @user_id,
                    @roadmap_id = @rid;
            end

        commit transaction;

    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go

------------------------------------------------------------------------------test submit_project-----------------------------------
select * from project where lid = 4;

exec submit_project @user_id = 2, @proj_id = 4;
exec submit_project @user_id = 2, @proj_id = 9;
exec submit_project @user_id = 9, @proj_id = 4;

select * from user_project where user_id = 4;
select * from progress     where user_id = 4;
select * from notification where user_id = 4;
select * from [user]

-- add sql server agent job to do so
create procedure update_streak 
as
begin
	set nocount on;

	--increment streak for users 
	update [user] set streak = streak + 1
	where last_act_date = cast( dateadd(day , -1 , getdate()) as date)
	and status = 'active';

	--reset streak for users
    update [user]
    set streak = 0
    where last_act_date < cast(dateadd(day, -1, getdate()) as date)
    and status = 'active';
end
go

--SQL Server Agent Job to add streaks everyday

exec msdb.dbo.sp_add_job
    @job_name = 'Daily Streak Update';

exec msdb.dbo.sp_add_jobstep
    @job_name  = 'Daily Streak Update',
    @step_name = 'Run update_streak',
    @command   = 'exec update_streak;',
    @database_name = 'mind_road';

-- Add the schedule
exec msdb.dbo.sp_add_schedule
    @schedule_name  = 'Daily Midnight',
    @freq_type      = 4,        -- daily
    @freq_interval  = 1,        -- every 1 day
    @active_start_time = 000000; -- midnight 00:00:00

-- Attach schedule to job
exec msdb.dbo.sp_attach_schedule
    @job_name      = 'Daily Streak Update',
    @schedule_name = 'Daily Midnight';

--Assign job to server
exec msdb.dbo.sp_add_jobserver
    @job_name = 'Daily Streak Update';



create procedure add_roadmap
    @name        nvarchar(100),
    @description nvarchar(500) = null,
    @track_id    int
as
begin
    set nocount on;

    begin try

        -- Validate name
        if @name is null or ltrim(rtrim(@name)) = ''
        begin
            raiserror('Roadmap name cannot be empty.', 16, 1);
            return;
        end

        -- Validate track exists
        if not exists (select 1 from track where track_id = @track_id)
        begin
            raiserror('Track does not exist.', 16, 1);
            return;
        end

        begin transaction;

            -- Insert roadmap
            insert into roadmap (name, description, track_id)
            values (@name, @description, @track_id);

            declare @new_rid int = scope_identity();

            -- Auto-create 3 levels
            insert into level (name, rid) values
            ('Beginner',     @new_rid),
            ('Intermediate', @new_rid),
            ('Advanced',     @new_rid);

        commit transaction;

    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go

----------------------------------------------------------------------test procedure add_roadmap---------------------

exec add_roadmap
    @name     = 'Django',
    @track_id = 2;
select * from roadmap where name = 'Django';
exec add_roadmap @name = '', @track_id = 2;
exec add_roadmap @name = 'Django', @track_id = 99;

create procedure add_comment 
	@user_id int,
	@topic_id int,
	@content varchar(1000),
	@parent_com_id int = null
as 
begin
	set nocount on;
	begin try
		if exists (select 1 from [user] where user_id = @user_id and role = 'guest')
		begin
		    raiserror('Guests are not allowed to perform this action.', 16, 1);
		    return;
		end
		if @content is null or ltrim(rtrim(@content)) = ''
		begin
			raiserror('write something first! ',16,1);
			return;
		end
		if @parent_com_id is not null and 
		   not exists (select 1 from comment where parent_com_id = @parent_com_id)
		begin
			raiserror('parent comment does not exist',16,1);
			return;
		end

		begin transaction;
		insert into comment ( content , topic_id , parent_com_id) values
		(@content, @topic_id , @parent_com_id);

		declare @new_com_id int = scope_identity();

		insert into user_comment(user_id,com_id) values
		(@user_id , @new_com_id)

		
        if @parent_com_id is not null
        begin
            declare @parent_user_id int;
		    
            select @parent_user_id = uc.user_id
            from user_comment uc
            where uc.com_id = @parent_com_id;
		    
            if @parent_user_id <> @user_id
            begin
                exec send_notification
                    @userId  = @parent_user_id,
                    @message  = N'Someone replied to your comment.',
                    @ref_id   = @new_com_id,
                    @ref_type = 'comment';
            end
        end
        commit transaction;
    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go
---------------------------------------------------------------------------------------test add_comment-------------------------------------------------
select top 3 topic_id, name from topic;
exec add_comment @user_id = 2, @topic_id = 1, @content = 'Great topic!';
exec add_comment @user_id = 3, @topic_id = 1, @content = 'I agree!', @parent_com_id = 1;
exec add_comment @user_id = 2, @topic_id = 1, @content = 'Thanks!', @parent_com_id = 1;
exec add_comment @user_id = 2, @topic_id = 1, @content = '';
exec add_comment @user_id = 2, @topic_id = 1, @content = 'Hello', @parent_com_id = 999;

select * from comment      where topic_id = 1;
select * from user_comment where user_id in (2, 3);
select * from notification where user_id in (2, 3);

create procedure add_review
    @user_id int,
    @rid     int,
    @rate    int,
    @content nvarchar(500) = null
as
begin
    set nocount on;
    begin try 
	if exists (select 1 from [user] where user_id = @user_id and role = 'guest')
		begin
		    raiserror('Guests are not allowed to perform this action.', 16, 1);
		    return;
		end

        if @rate < 1 or @rate > 5
        begin
            raiserror('Rate must be between 1 and 5.', 16, 1);
            return;
        end
        if not exists (
            select 1 from progress p
            join level l on p.lid = l.lid
            where p.user_id = @user_id
            and l.rid = @rid
        )
        begin
            raiserror('User must be enrolled in roadmap to review it.', 16, 1);
            return;
        end
        begin transaction;

            -- Upsert: update if exists, insert if not
            if exists (select 1 from review where user_id = @user_id and rid = @rid)
            begin
                update review
                set rate       = @rate,
                    content    = @content,
                    created_at = getdate()
                where user_id = @user_id
                and rid = @rid;
            end
            else
            begin
                insert into review (content, rate, created_at, user_id, rid)
                values (@content, @rate, getdate(), @user_id, @rid);
            end

        commit transaction;

    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go

-------------------------------------------------------------------------------test add_review------------------------------------------
exec add_review @user_id = 3, @rid = 1, @rate = 5, @content = 'Amazing roadmap!';
exec add_review @user_id = 3, @rid = 1, @rate = 3, @content = 'Changed my mind.';
exec add_review @user_id = 2, @rid = 1, @rate = 6;
exec add_review @user_id = 2, @rid = 1, @rate = 0;
exec add_review @user_id = 4, @rid = 99, @rate = 4;

select * from review where user_id = 3;

create procedure toggle_bookmark
    @user_id int,
    @res_id  int
as
begin
    set nocount on;
	if exists (select 1 from [user] where user_id = @user_id and role = 'guest')
		begin
		    raiserror('Guests are not allowed to perform this action.', 16, 1);
		    return;
		end
    begin transaction;

        if exists (select 1 from bookmark where user_id = @user_id and res_id = @res_id)
        begin
            delete from bookmark
            where user_id = @user_id and res_id = @res_id;
        end
        else
        begin
            insert into bookmark (user_id, res_id)
            values (@user_id, @res_id);
        end

    commit transaction;
end
go
------------------------------------------------------------------------------------test toggle bookmark-------------------------------------
exec toggle_bookmark @user_id = 2, @res_id = 1;
exec toggle_bookmark @user_id = 2, @res_id = 1;
exec toggle_bookmark @user_id = 2, @res_id = 1;

select * from bookmark where user_id = 2;


create procedure mark_notifications_read
    @user_id int,
    @not_id  int = null   -- null = mark all as read
as
begin
    set nocount on;

    if @not_id is null
    begin
        -- Mark all notifications as read
        update notification
        set [read] = 1
        where user_id = @user_id
        and [read] = 0;
    end
    else
    begin
        -- Mark specific notification as read
        update notification
        set [read] = 1
        where not_id = @not_id
        and user_id = @user_id;
    end
end
go
----------------------------------------------------------------------------------------------------test mark_notifications_read-------------------------------------------------------------
exec mark_notifications_read @user_id = 2;
select * from notification where user_id = 2;

exec send_notification @userId = 2, @message = 'Test notification';
exec send_notification @userId = 2, @message = 'Test notification 2';

exec mark_notifications_read @user_id = 2, @not_id = 1;
select * from notification where user_id = 2;

exec mark_notifications_read @user_id = 2;
select * from notification where user_id = 2;



create procedure ban_user
    @user_id int
as
begin
    set nocount on;
    begin try
        if not exists (select 1 from [user] where user_id = @user_id)
        begin
            raiserror('User does not exist.', 16, 1);
            return;
        end
        if exists (select 1 from [user] where user_id = @user_id and status = 'banned')
        begin
            raiserror('User is already banned.', 16, 1);
            return;
        end
        -- Check user is not admin
        if exists (select 1 from [user] where user_id = @user_id and role = 'admin')
        begin
            raiserror('Cannot ban an admin.', 16, 1);
            return;
        end
        begin transaction;
            update [user]
            set status = 'banned'
            where user_id = @user_id;

            exec send_notification
                @userId  = @user_id,
                @message  = N'Your account has been banned. Please contact support.',
                @ref_id   = null,
                @ref_type = null;

        commit transaction;
    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go
-----------------------------------------------------------------------------------------------------test ban users----------------------------------------------------------
exec ban_user @user_id = 4;
exec ban_user @user_id = 4;
exec ban_user @user_id = 1;
exec ban_user @user_id = 999;

select user_id, username, status from [user];
select * from notification where user_id = 4;
update [user] set status = 'active' where user_id = 4

create procedure change_plan
    @user_id    int,
    @new_plan_id int
as
begin
    set nocount on;
    begin try
        -- Check plan exists
        if not exists (select 1 from [plan] where pid = @new_plan_id)
        begin
            raiserror('Plan does not exist.', 16, 1);
            return;
        end
        -- Check user is not already on this plan
        if exists (select 1 from [user] where user_id = @user_id and pid = @new_plan_id)
        begin
            raiserror('User is already on this plan.', 16, 1);
            return;
        end
        begin transaction;
            update [user]
            set pid = @new_plan_id
            where user_id = @user_id;

            declare @plan_name nvarchar(100);
            select @plan_name = name from [plan] where pid = @new_plan_id;
			declare @msg nvarchar(200) = N'Your plan has been updated to ' + @plan_name + N'.';

            exec send_notification
                @userId  = @user_id,
                @message  = @msg,
                @ref_id   = @new_plan_id,
                @ref_type = 'plan';
        commit transaction;
    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        throw;
    end catch
end
go
-------------------------------------------------------------------------------------------------------------test change plan--------------------------------------------
exec change_plan @user_id = 4, @new_plan_id = 2;
exec change_plan @user_id = 4, @new_plan_id = 2;
exec change_plan @user_id = 4, @new_plan_id = 99;

select user_id, username, pid from [user] where user_id = 4;
select * from notification where user_id = 4;


--------------------------------------------------------------------------------------------------------------views-------------------------------------------------------------
create view vw_user_dashboard as
select
    u.user_id,
    u.username,
    u.streak,
    u.last_act_date,
    pl.name as [plan],
    t.name as track,
    r.name as roadmap,
    l.name as level,
    p.comp_perc
from [user] u
join [plan] pl  on u.pid    = pl.pid
join user_track ut on u.user_id = ut.user_id
join track t on ut.track_id  = t.track_id
join roadmap r  on r.track_id = t.track_id
join level l on l.rid= r.rid
join progress p on p.lid= l.lid
and p.user_id   = u.user_id;
go

select * from vw_user_dashboard

create view vw_user_progress as
select
    u.user_id,
    u.username,
    r.rid,
    r.name as roadmap,
    l.lid,
    l.name  as level,
    p.comp_perc,
    case when up.proj_id is not null
         then 'Submitted'
         else 'Not Submitted'
    end                     as project_status
from [user] u
join progress p on p.user_id  = u.user_id
join level l on p.lid = l.lid
join roadmap r on l.rid = r.rid
left join project pr on pr.lid  = l.lid
left join user_project up on up.proj_id = pr.proj_id
and up.user_id = u.user_id;
go

select * from vw_user_progress

create view vw_user_certificate as
select 
	u.user_id,
	u.username,
	r.name as roadmap,
	t.name as track,
	c.cert_url,
	c.issued_at
from [user] u
join certificate c on c.user_id = u.user_id
join roadmap r on c.rid = r.rid
join track t on t.track_id = r.track_id;
go
	
select * from vw_user_certificate

create view vw_user_bookmarks as
select
    u.user_id,
    u.username,
    res.res_id,
    res.name as resource,
    res.type,
    res.res_url,
    res.paid,
    tp.name as topic,
    l.name as level,
    r.name as roadmap
from [user] u
join bookmark b on b.user_id = u.user_id
join resource res on b.res_id = res.res_id
join topic tp on res.topic_id = tp.topic_id
join level l on tp.lid = l.lid
join roadmap r on l.rid = r.rid;
go
	
select * from vw_user_bookmarks

create view vw_roadmap_details as
select
    r.rid,
    r.name as roadmap,
    r.description,
    t.name as track,
    count(distinct l.lid) as total_levels,
    count(distinct tp.topic_id) as total_topics,
    count(distinct res.res_id) as total_resources,
    avg(cast(rv.rate as decimal(5,2))) as avg_rating,
    count(distinct rv.rev_id) as total_reviews
from roadmap r
join track  t on r.track_id = t.track_id
left join level l on l.rid = r.rid
left join topic tp on tp.lid = l.lid
left join resource res on res.topic_id = tp.topic_id
left join review rv on rv.rid= r.rid
group by r.rid, r.name, r.description, t.name;
go

select * from vw_roadmap_details

create view vw_topic_resources as
select
    r.rid,
    r.name as roadmap,
    l.lid,
    l.name as level,
    tp.topic_id,
    tp.name as topic,
    tp.[order] as topic_order,
    res.res_id,
    res.name as resource,
    res.[order] as resource_order,
    res.type,
    res.res_url,
    res.paid
from roadmap r
join level l on l.rid = r.rid
join topic tp on tp.lid = l.lid
join resource res on res.topic_id = tp.topic_id;
go
select * from vw_topic_resources

create view vw_roadmap_reviews as
select
    r.rid,
    r.name as roadmap,
    u.username,
    rv.rate,
    rv.content,
    rv.created_at
from review rv
join roadmap r on rv.rid = r.rid
join [user] u on rv.user_id = u.user_id;
go

select * from vw_roadmap_reviews

create view vw_comment_threads as
select
    c.com_id,
    c.content,
    c.created_at,
    c.topic_id,
    tp.name as topic,
    u.username,
    c.parent_com_id,
    case when c.parent_com_id is null
         then 'comment'
         else 'reply'
    end as type
from comment c
join user_comment uc on uc.com_id   = c.com_id
join [user] u on uc.user_id  = u.user_id
join topic tp on c.topic_id  = tp.topic_id;
go

select * from vw_comment_threads

create view vw_leaderboard as
select
    u.user_id,
    u.username,
    u.streak,
    count(distinct c.rid) as completed_roadmaps,
    avg(p.comp_perc) as avg_progress
from [user] u
left join certificate c on c.user_id = u.user_id
left join progress p on p.user_id = u.user_id
where u.status = 'active'
and u.role = 'user'
group by u.user_id, u.username, u.streak;
go

select * from vw_leaderboard

create view vw_roadmap_stats as
select
    r.rid,
    r.name as roadmap,
    t.name as track,
    count(distinct p.user_id) as total_enrollments,
    count(distinct c.user_id) as total_completions,
    avg(cast(rv.rate as decimal(5,2))) as avg_rating
from roadmap r
join track t on r.track_id  = t.track_id
left join level l on l.rid = r.rid
left join progress p on p.lid = l.lid
left join certificate c on c.rid = r.rid
left join review rv  on rv.rid = r.rid
group by r.rid, r.name, t.name;
go

select * from vw_roadmap_stats


-----------------------------------------------------------------------------------------------------------------indexing-------------------------------------------------------
-- resource
create index idx_resource_topic_id on resource(topic_id);

-- topic
create index idx_topic_lid on topic(lid);

-- level
create index idx_level_rid on level(rid);

-- roadmap
create index idx_roadmap_track_id on roadmap(track_id);

-- progress
create index idx_progress_user_id on progress(user_id);
create index idx_progress_lid on progress(lid);

-- notification
create index idx_notification_user_id on notification(user_id);

-- review
create index idx_review_user_id on review(user_id);
create index idx_review_rid on review(rid);

-- comment
create index idx_comment_topic_id on comment(topic_id);
create index idx_comment_parent_com_id on comment(parent_com_id);

-- user_resource
create index idx_user_resource_user_id on user_resource(user_id);
create index idx_user_resource_res_id on user_resource(res_id);

-- user_project
create index idx_user_project_user_id on user_project(user_id);
create index idx_user_project_proj_id on user_project(proj_id);

-- bookmark
create index idx_bookmark_user_id on bookmark(user_id);
create index idx_bookmark_res_id on bookmark(res_id);

-- certificate
create index idx_certificate_user_id on certificate(user_id);
create index idx_certificate_rid on certificate(rid);

-- user_track
create index idx_user_track_user_id on user_track(user_id);
create index idx_user_track_track_id on user_track(track_id);

-- user_comment
create index idx_user_comment_user_id on user_comment(user_id);
create index idx_user_comment_com_id on user_comment(com_id);

-- project
create index idx_project_lid on project(lid);

-- frequently searched columns
create index idx_user_status on [user](status);
create index idx_notification_read on notification([read]);
create index idx_resource_type on resource(type);

create index idx_user_last_act_date on [user](last_act_date);
create index idx_resource_paid on resource(paid);

