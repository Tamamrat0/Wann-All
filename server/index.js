import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
// import ChatRoute from './routes/chat.js'
import authRoutes from './routes/auth.js'
import  userRoutes  from './routes/users.js';  
import  permissRoutes  from './routes/permiss.js';  
import  assetsRoutes from './routes/assets.js'
import  ticketRoutes  from './routes/Ticket.js';  
import cookieParser  from 'cookie-parser';
import { Server } from "socket.io";



// ----------------CONFIG----------------------
const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" , extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended:true}));
app.use(cors({
    credentials: true,
    origin: process.env.URL_CLIENT,
}));
app.use("/assets",express.static(path.join(__dirname , 'public/assets')));
app.use(cookieParser())
// --------------------------------------

const storage = multer.diskStorage({
    destination:function(req , file , cb) {
        cb(null,'public/assets')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
})
const upload = multer({ storage: storage });


// ----------ROUTES WITH FILE-------------
// app.post('/auth/register',upload.single('picture'),register);
// app.post('/posts', verifyToken , upload.single('picture'), createPost);
app.use('/auth',authRoutes);
app.use('/users', userRoutes);
app.use('/ticket', ticketRoutes)
app.use('/permiss', permissRoutes);
app.use('/assets', assetsRoutes);
// app.use('/posts', postRoutes);
// app.use('/chat', ChatRoute);


// ----------CONNECT SQL ---------------
const PORT = process.env.PORT || 6001;
const server = app.listen(PORT, () => {
    console.log(`Server Start on port: ${PORT}`);
  });
  


  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  let onlineUsers = []
  
  io.on('connection',(socket)=>{
  
    const { username , userId , dept} = socket.handshake.query;
    
    console.log(` ${username} connected`)
   
    if(!onlineUsers.some(item => item.id === userId)){
        onlineUsers = [...onlineUsers ,{id:userId , _id:socket.id , dept:dept}]
    }
    io.emit('userOnline', onlineUsers);

    socket.on('newTickets',(data)=>{

      const deptUser = onlineUsers.filter(user => user.dept === data[0].tik_to)
      console.log(deptUser)
      deptUser.forEach(user => {
        
        io.to(user._id).emit('receiveTickets', data[0]);
    });
    })

    socket.on('create_room',(data)=> {
      console.log(`${data.user} Join_room ${data.room}`)
      socket.join(data.room);
    })

    socket.on("leave_room",(data)=>{
      console.log(`${data.user} Leave_room ${data.room}`)
      socket.leave(data.room);
    })

    socket.on('onedit_user' , (data)=>{
      socket.to('userpage').to('permissionpage').emit('after_edit_user' , data)
      console.log('onedit_user')
    })

    socket.on('onedit_permission' , (data)=>{
      //  console.log(data)
      socket.to('userpage').to('permissionpage').emit('after_edit_permission' , data)
      console.log('onedit_permission')
    })

    socket.on('disconnect', () => {

          onlineUsers = onlineUsers.filter(item => item._id !== socket.id)

          io.emit('userOffline', onlineUsers); // ส่งอีเวนท์แจ้งให้ทุกคนทราบว่าผู้ใช้ออฟไลน์
          
      
        });
        console.log(onlineUsers)
  })
  