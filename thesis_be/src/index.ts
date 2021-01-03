import * as express from 'express';
import * as FileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import { fileStatus, fileUpload } from './upload';



let expressServer = express();

expressServer.use(bodyParser.json({ limit: '50mb' }));
expressServer.use(FileUpload({
    limits: { fileSize: 500 * 1024 * 1024 }, useTempFiles: true
}));



expressServer.use((_req, res, next) => {
    console.log(_req.originalUrl);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    next();
});

expressServer.post('/upload', fileUpload);
expressServer.get('/upload', fileUpload);
expressServer.get('/status/:id', fileStatus);


expressServer.use('/file/res', express.static(__dirname + '/../tmp'));






expressServer.listen(5000, function () {
    // if (err) {
    //     console.log(`something bad happened: ${err}`);
    // }
    console.log(`Server is listening on 5000`);
});