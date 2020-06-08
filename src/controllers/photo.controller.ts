import { Request, Response} from 'express'
import Photo from '../models/Photo'
import fse from 'fs-extra' 
import path from 'path'

export async function getPhotos(req: Request, res: Response):Promise<Response> {
    const photos = await Photo.find()

    return res.json(photos)
}

export async function getPhotoById(req: Request, res: Response):Promise<Response> {
    const { id }  = req.params

    const photo = await Photo.findById(id)
    return res.json(photo)
}

export async function getPhotoByTitleDes(req:Request, res:Response):Promise<Response> {
    const { id } = req.params

    const photos = await Photo.find({
        $or: [
          { title: { $regex: id } },
          { description: { $regex: id } }
        ]
      })

    return res.json(photos)
}

export async function deletePhotoById(req: Request, res: Response):Promise<Response> {
    const  { id }  = req.params

    const photo = await Photo.findByIdAndDelete(id)

    if (photo) {
        if (photo?.imagePath) {
            await fse.unlink(path.resolve(photo.imagePath))
        }
    }
    return res.json({message: 'Foto borrada', photo})
}

export async function createPhoto(req: Request, res: Response):Promise<Response> {
    const { title, description } = req.body
    let imagePath = req.file?.path

    const newPhoto = {
        title,
        description,
        imagePath: imagePath
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
    
    let oldPhoto:{title: string, description: string, imagePath:string} | null = { title: '', description: '', imagePath: '' }
    let updatePhoto:{title: string, description: string, imagePath:string} | null = { title: '', description: '', imagePath: '' }
    oldPhoto = await Photo.findById(id)

    if (oldPhoto) {
        if(oldPhoto.title) updatePhoto.title = oldPhoto.title
        if(oldPhoto.description) updatePhoto.description = oldPhoto.description
        if(oldPhoto.imagePath) updatePhoto.imagePath = oldPhoto.imagePath

        if (title) updatePhoto.title = title
        if (description) updatePhoto.description = description
        if (imagePath) {
            if (oldPhoto.imagePath) {
                await fse.unlink(path.resolve(updatePhoto.imagePath))
            }
            updatePhoto.imagePath = imagePath
        }
        try {
            await Photo.findByIdAndUpdate(req.params.id, updatePhoto)
        } catch (error) {
            console.log(error)
        }
    }

    return res.json({
        message: 'Successfully updated',
        updatePhoto
    })
}


