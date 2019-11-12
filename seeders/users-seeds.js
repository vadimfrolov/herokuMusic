const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/final", {
  useNewUrlParser: true
});

const User = require("../models/users");

const users = [
  {
  username: 'Jonh Doe',
  email: 'johndoe@example.ru',
  password: '123',
  favouriteGroups: ['Metallica', 'M.I.A.', 'Britney Spears'],
  upcomingConcerts: [{group:'Chrysta Bell', date:new Date('2019-11-07'), location: 'Moscow'}, {group:'Дельфин', date:new Date('2019-12-15'), location: 'London'}, {group:'Нейромонах Феофан', date:new Date('2019-12-27'), location: 'Saint-Petersburg'}],
  previousConcerts: [{group:'AC/DC', date:new Date('2015-11-05'), location: 'Brooklin'}, {group:'Radiohead', date:new Date('2016-10-02'), location: 'New-York'}, {group:'Madonna', date:new Date('2017-09-21'), location: 'Barcelona'}],
  city: 'Moscow',
  comments: [],
  recommendations: ["https://www.billboard.com/files/styles/article_main_image/public/media/02-grimes-2018-press-cr-eli-russell-linnetz-billboard-1548.jpg", ],
  role: 'user',
  userPic: 'https://pngimage.net/wp-content/uploads/2018/06/john-doe-png.png'
  },

];

User.insertMany(users).then(() => {
  mongoose.connection.close();
});