# tailwebProject

### To Do;

# first we have to create user model :-
## user model contain username, name, password.

# second we have to create marks model :-;
# the marks model contain subject, marks, studentName, user ref.

### The task is to create user registration first.
app.post("/user")
after that user login with their username and password. On successful login we have to return token response.
(and this time we have to set token into req.body/headers)

##  the other task is to create (post api) students with their user/teacher
app.post("/student") 
### How to create students with teacher is the main task to perform:-
In this student creation, we have to add that teacher who want to create student information.
So we can say that we will refer the user from user model into student post api.
# how will I connect that teacher who has created students?
On the time of creation of token (when we login user that time I'll create token) we will set the userId into req.body(headers/bearer token)
At the time of student creation we will get the userId from req.body or headers(if we get userid from headers then at the time of token creation we will set the token into headers) and it should match with headers token(userId/authorisation);

### (Think about the time of creation of student I should return user/teacher in the response or not, if not then how will we recognize whom cretae that student );

## next get api for student;
app.get("/students") here we will use filters to fetch ($regex) (one user/teacher can't have same students name )
# so here we have to return students details whose teacher/user are logged in.





