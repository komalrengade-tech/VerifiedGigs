const bcrypt = require("bcryptjs");

const password = "Test@123";

const hash = bcrypt.hashSync(password, 10);

console.log("Password:", password);
console.log("Hash:", hash);

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4Niwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTc4OTc1ODc5NiwiZXhwIjoxNzg5ODQ1MTk2fQ.JbbhbJepihdZGGZp2h5DQbl4iLSYXzaqxZyzLM4cgfE 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4NCwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3ODk3NTY5NDAsImV4cCI6MTc4OTg0MzM0MH0.7rYYtQi-pzILx_bND_wFgJgmP9LfPQEcU1Xy6hG5Zhc",
*/