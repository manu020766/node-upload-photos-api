import { Request, Response} from 'express'
import Photo, { IPhoto } from '../models/Photo'
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
        if (photo?.imagePath) {
            await fse.unlink(path.resolve(photo.imagePath))
            console.log('foto borrada')
        }
    }
    return res.json({message: 'Foto borrada', photo})
}

export async function createPhoto(req: Request, res: Response):Promise<Response> {
    const { title, description } = req.body
    console.log(req.file)

    const newPhoto = {
        title,
        description,
        imagePath: req.file?.path
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
    let imagePath = req.file?.path
    // console.log(title, description)
    
    let updateNewPhoto = null
    let oldPhoto:{title: string, description: string, imagePath:string} | null = { title: '', description: '', imagePath: '' }
    let newPhoto:{title: string, description: string, imagePath:string} | null = { title: '', description: '', imagePath: '' }
    oldPhoto = await Photo.findById(id)

    if (oldPhoto) {
        if(oldPhoto.title) newPhoto.title = oldPhoto.title
        if(oldPhoto.description) newPhoto.description = oldPhoto.description
        if(oldPhoto.imagePath) newPhoto.imagePath = oldPhoto.imagePath

        if (title) newPhoto.title = title
        if (description) newPhoto.description = description
        if (imagePath) {
            if (oldPhoto.imagePath) {
                await fse.unlink(path.resolve(newPhoto.imagePath))
            }
            newPhoto.imagePath = imagePath
        }
        try {
            await Photo.findByIdAndUpdate(req.params.id, newPhoto)
            updateNewPhoto = await Photo.findById(id)
        } catch (error) {
            console.log(error)
        }
    }

    return res.json({
        message: 'Successfully updated',
        updateNewPhoto
    })
}


