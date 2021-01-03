import * as express from 'express';
import { send_response } from './express';
import * as fs from 'fs';
import * as gsshell from 'gs-shell';


export async function fileUpload(req: express.Request, res: express.Response) {

    let id = (new Date()).getTime();
    // req.on("data",(d: Buffer)=>{
    //     console.log(d.toString());
    // });

    if ((<any>req).files !== undefined) {
        let folder = __dirname + '/../tmp/' + id;
        fs.mkdirSync(folder);

        let fileKeys = Object.keys((<any>req).files);
        let section = fileKeys[0];
        let files: FileType | FileType[] = (<any>req).files[section];
        if (Array.isArray(files)) {
            await Promise.all(files.map(f => {
                return uploadFile(f,folder,id);
            }));
        } else {
            await uploadFile(files,folder,id);
        }
    }
    send_response(res, {id:id}, "application/json");
};


async function uploadFile(file: FileType, folder:string, id:number) {
    


    // console.log(file);


    file.mv(folder + '/' + file.name, async (_err) => {

        setTimeout(async ()=>{
            let script = `source ../../venv/bin/activate
cp ../tmp/${id}/${file.name} ../../White-box-Cartoonization/test_code/test_images/${file.name}
ls ../../White-box-Cartoonization/test_code/test_images
pwd
python ../../White-box-Cartoonization/test_code/cartoonize.py
mv ../../White-box-Cartoonization/test_code/cartoonized_images/${file.name} ../tmp/${id}/out.jpg
rm ../../White-box-Cartoonization/test_code/test_images/${file.name}
deactivate`;

            // console.log(script);
            let o = await gsshell.execute_script(script, __dirname);
            // console.log(o.output);
            //fs.copyFileSync(folder + '/' + file.name,folder + '/out.jpg');
        },5000)
        // console.log(err)
        // if (file.mimetype === 'image/jpeg') {
        //     let image = await sharp(unescoUploadFilePath + '/' + jobId);
        //     let m = await image.metadata();
        //     let new_width: number = 0;
        //     let new_height: number = 0;
        //     if (m.width > m.height) {
        //         new_width = 1000;
        //         new_height = Math.round(1000 * m.height / m.width);
        //         image = await image.resize(new_width, new_height)
        //     } else {
        //         new_width = Math.round(1000 / m.height * m.width);
        //         new_height = 1000;
        //         image = await image.resize(new_width, new_height);
        //     }
        //     image.toFile(unescoUploadFilePath + '/thumbs/' + jobId + ".jpg");
        //     mongo_unesco.updateOne('unesco-db-files', { "_id": new mongo.ObjectId(jobId) }, { $set: { "thumb": jobId + ".jpg" } })
        // }
    })
}




interface FileType {
    size: number, name: string, mimetype: string, tempFilePath: string, md5: string, encoding: string, mv: (uploadPath: string, callback: (err: any) => void) => void
}




export async function fileStatus(req: express.Request, res: express.Response) {

    
    let id = req.params['id'];
    if(fs.existsSync(__dirname + '/../tmp/' + id + "/out.jpg")){
        send_response(res, {status:"complete"}, "application/json");
    }else{
        send_response(res, {status:"pending"}, "application/json");
    }
};