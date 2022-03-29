import express, { Application } from 'express';
import cors from 'cors';

// import http from 'http';
// import socketIO from 'socket.io';

import AuthRouter from '../routes/auth';

class Server {
  private app:Application;
  private port:string;
  
  // private server: http.Server;
  // private io:socketIO.Server;

  private paths;

  constructor() {
    this.app = express();
    this.port = process.env.PORT ?? "8080";

    // this.server = http.createServer(this.app);
    // this.io = new socketIO.Server(this.server);

    this.paths = {
      auth: '/api/auth'
    }

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({extended: true}));
  }

  routes() {
    this.app.use(this.paths.auth, AuthRouter);
  }

  listen(){
    // this.server.listen(this.port, () => console.log(`Listening localhost:${this.port}`)) //->sockets
    this.app.listen(this.port, () => console.log(`Listening localhost:${this.port}`));
  }
}

export default Server;