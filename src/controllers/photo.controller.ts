import { Request, Response} from 'express'
import Photo from '../models/Photo'
import fse, { fstat } from 'fs-extra' 
import path from 'path'

export async function getPhoto(req: Request, res: Response):Promise<Response> {
    const photos = await Photo.find()

    return res.json(photos)
}

export async function getPhotoById(req: Request, res: Response):Promise<Response> {
    const  idPhoto  = req.params.id

    const photo = await Photo.findById(idPhoto)
    return res.json(photo)
}

export async function deletePhotoById(req: Request, res: Response):Promise<Response> {
    const  { id }  = req.params

    const photo = await Photo.findByIdAndDelete(id)

    if (photo) {
        await fse.unlink(path.resolve(photo.imagePath))
        console.log('foto borrada')
    }
    return res.json({message: 'Foto borrada', photo})
}

export async function createPhoto(req: Request, res: Response):Promise<Response> {
    const { title, description } = req.body
    console.log(req.file)

    const newPhoto = {
        title,
        description,
        imagePath: req.file.path
    }

    const photo = new Photo(newPhoto)
    await photo.save()

    return res.json({
        message: 'Photo succesfully created',
        photo
    })
}

export async function updatePhoto(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { title, description } = req.body
    console.log(title, description)

    const newPhoto = {
        title,
        description,
        imagePath: req.file.path
    }

    await Photo.findByIdAndUpdate(req.params.id, newPhoto)
    let updateNewPhoto = await Photo.findById(id)

    return res.json({
        message: 'Successfully updated',
        updateNewPhoto
    })
}


