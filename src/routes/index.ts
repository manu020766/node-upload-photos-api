import { Router } from 'express'
const router = Router()

import { createPhoto, getPhotos, getPhotoById, deletePhotoById, updatePhoto } from '../controllers/photo.controller'
import multer from '../libs/multer'

router.route('/photos')
    .get(getPhotos)
    .post(multer.single('image'), createPhoto)

router.route('/photos/:id')
    .get(getPhotoById)
    .delete(deletePhotoById)
    .put(multer.single('image'), updatePhoto)

export default router