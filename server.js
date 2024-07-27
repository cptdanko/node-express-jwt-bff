const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 3001;

app.use(express.json());
const users = [
	{id:1, username: "user1", password: bcrypt.hashSync("temp", 8)},
	{id:1, username: "qin@gmail.com", password: bcrypt.hashSync("temp", 8)},
];

app.post('/api/login', (req, res) => {
	const {username, password } = req.body;
	console.log(`Username ${username} and pass ${password}`)

	const user = users.find(u => u.username === username);
	if(!user) return res.status(404).send('user not found');

	const passwordIsValid = bcrypt.compareSync(password, user.password);
	if(!passwordIsValid) return res.status(401).send('Invalid credentials');
	
	const token = jwt.sign({id: user.id}, 'secret', {'expiresIn': 86400});
	res.status(200).send({auth: true, token});
});

app.get('/api/protected', (req, res) => {
	const token = req.headers['x-access-token'];
	if(!token) return res.status(403).send('No token provided');
	console.log(`Sending token ${token}`);
	jwt.verify(token, 'secret', (err, decoded) => {
		if(err) return res.status(500).send('Failed to authenticate on server');
		res.status(200).send({message: 'Access Granted'});
	});
});

app.get('/api/message', (req,res) => {
	res.json({'message': 'Hello from the server'});
});

app.listen(PORT, () => {
	console.log('Server is running on port '+ PORT);
});
