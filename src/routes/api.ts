import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware'
import mediaMiddleware from '../middleware/media.middleware';
import mediaController from '../controllers/media.controller';
import aclMiddleware from '../middleware/acl.middleware';
import { ROLES } from '../utils/constant';
import competencyController from '../controllers/competency.controller';
import subCompetencyController from '../controllers/subCompetency.controller';
import kuisCompetencyController from '../controllers/kuisCompetency.controller';
import kajianController from '../controllers/kajian.controller';
import { uploadExcel } from '../middleware/upload.middleware';
import scoreController from '../controllers/score.controller';
import videoController from '../controllers/video.controller';
import resumeController from '../controllers/resume.controller';
import saveController from '../controllers/save.controller';
import completedController from '../controllers/completed.controller';
import lkpController from '../controllers/lkp.controller';
import { SECRET } from '../utils/env';
import notificationController from '../controllers/notification.controller';


const router = express.Router();

router.post('/auth/register', authController.register
    /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/RegisterRequest"}
        }
    */
);
router.post('/auth/login', authController.login
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/LoginRequest"}
        }
        */
);
router.get('/auth/me', authMiddleware, authController.me
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
            "bearerAuth": []
        }]
        */
    )
    router.get('/auth/user', authMiddleware, aclMiddleware([ROLES.ADMIN]), authController.findAll

    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
    */
)
router.get('/auth/user/:id', authController.findById
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
    */
)
router.put('/auth/user/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), authController.updateUser
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.requestBody = {
        required: true, 
        schema: {$ref: "#/components/schemas/UpdateUserAdminRequest"}
    }
    */
)
router.put('/auth/password', authMiddleware ,authController.updatePassword
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/UpdatePasswordRequest"}
        }
    */
);
router.put('/auth/password/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]) ,authController.adminUpdatePassword
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/UpdatePasswordAdminRequest"}
        }
    */
);
router.put('/auth/role/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]) ,authController.updateRole
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
    */
);
router.put('/auth/image', authMiddleware ,authController.updateImage
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
    */
);
router.delete('/auth/user/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), authController.deleteUser
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
)
router.post(
  '/auth/register/bulk',
  authMiddleware, aclMiddleware([ROLES.ADMIN]),
  uploadExcel.single("file"),
  authController.bulkRegister
/*
    #swagger.tags = ['Auth']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.consumes = ['multipart/form-data']
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        file: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
  */
);

/// NOTIFICATION
router.post('/notification/token', authMiddleware, notificationController.token
    /*
    #swagger.tags = ['Notification']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateTokenRequest"
        }
    }
    */
)
router.post('/notification/send', authMiddleware, notificationController.sendNotif
    /*
    #swagger.tags = ['Notification']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateNotificationRequest"
        }
    }
    */
);

/// LKP
router.post('/lkp/mark', authMiddleware, lkpController.mark
    /*
    #swagger.tags = ['LKP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateAbsenRequest"
        }
    }
    */
)
router.get('/lkp-user', authMiddleware, lkpController.getLkpByUser
    /*
    #swagger.tags = ['LKP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/lkp-rekap', authMiddleware, lkpController.getAllHistory
    /*
    #swagger.tags = ['LKP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// COMPLETED
router.post('/completed', authMiddleware , completedController.create
    /*
    #swagger.tags = ['Completed']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompletedRequest"
        }
    }
    */
)
router.get('/completed-user', authMiddleware , completedController.findAllByUser
    /*
    #swagger.tags = ['Completed']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KAJIAN
router.post('/kajian', authMiddleware, aclMiddleware([ROLES.ADMIN]), kajianController.create
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKajianRequest"
        }
    }
    */
)
router.get('/kajian', kajianController.findAll
    /*
    #swagger.tags = ['Kajian']
    */
)
router.get('/kajian/:id', kajianController.findOne
    /*
    #swagger.tags = ['Kajian']
    */
)
router.put('/kajian/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kajianController.update
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompetencyRequest"
        }
    }
    */
)
router.delete('/kajian/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kajianController.remove
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kajian/:slug/slug', kajianController.findOneBySlug
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// RESUME
router.post('/resume', authMiddleware, resumeController.create
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateResumeRequest"
        }
    }
    */
)
router.get('/resume', authMiddleware, resumeController.findAll
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume/:id', resumeController.findOne
    /*
    #swagger.tags = ['Resume']
    */
)
router.delete('/resume/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), resumeController.remove
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume/:kajian/kajian', authMiddleware, resumeController.findAllByKajian
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume-user', authMiddleware, resumeController.findAllByUser
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SAVE
router.post('/save', authMiddleware, saveController.create
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSaveRequest"
        }
    }
    */
)
router.get('/save', authMiddleware, saveController.findAll
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/save/:id', saveController.findOne
    /*
    #swagger.tags = ['Save']
    */
)
router.put('/save/:id', authMiddleware, saveController.update
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSaveRequest"
        }
    }
    */
)
router.delete('/save/:id', saveController.remove
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/save/:competency/competency', authMiddleware, saveController.findAllByCompetency
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/save-user', authMiddleware, saveController.findAllByUser
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// COMPETENCY
router.post('/competency', authMiddleware, aclMiddleware([ROLES.ADMIN]), competencyController.create
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompetencyRequest"
        }
    }
    */
)
router.get('/competency', competencyController.findAll
    /*
    #swagger.tags = ['Competency']
    */
)
router.get('/competency/:id', competencyController.findOne
    /*
    #swagger.tags = ['Competency']
    */
)
router.put('/competency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), competencyController.update
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompetencyRequest"
        }
    }
    */
)
router.delete('/competency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), competencyController.remove
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/competency/:slug/slug', competencyController.findOneBySlug
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/competency/:main_competency/main_competency', competencyController.findByMainCompetency
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// SUB COMPETENCY
router.post('/subcompetency', authMiddleware, aclMiddleware([ROLES.ADMIN]), subCompetencyController.create
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSubCompetencyRequest"
        }
    }
    */
)
router.get('/subcompetency', subCompetencyController.findAll
    /*
    #swagger.tags = ['Sub Competency']
    */
)
router.get('/subcompetency/:id', subCompetencyController.findOne
    /*
    #swagger.tags = ['Sub Competency']
    */
)
router.put('/subcompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), subCompetencyController.update

    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSubCompetencyRequest"
        }
    }
    */
)
router.delete('/subcompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), subCompetencyController.remove

    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/subcompetency/:slug/slug', subCompetencyController.findOneBySlug
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/subcompetency/:competencyId/competencyId', subCompetencyController.findAllByCompetency
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KUIS COMPETENCY
router.post('/kuiscompetency', authMiddleware, aclMiddleware([ROLES.ADMIN]), kuisCompetencyController.create
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisCompetencyRequest"
        }
    }
    */
)
router.get('/kuiscompetency', kuisCompetencyController.findAll
    /*
    #swagger.tags = ['Kuis Competency']
    */
)
router.get('/kuiscompetency/:id', kuisCompetencyController.findOne
    /*
    #swagger.tags = ['Kuis Competency']
    */
)
router.put('/kuiscompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kuisCompetencyController.update
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisCompetencyRequest"
        }
    }
    */
)
router.delete('/kuiscompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kuisCompetencyController.remove
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuiscompetency/:subCompetencyId/subCompetencyId', kuisCompetencyController.findAllBySubCompetency
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SCORE
router.post('/score', authMiddleware , scoreController.create
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreRequest"
        }
    }
    */
)
router.get('/score', scoreController.findAll
    /*
    #swagger.tags = ['Score']
    */
)
router.get('/score/:id', scoreController.findOne
    /*
    #swagger.tags = ['Score']
    */
)
router.delete('/score/:id', scoreController.remove
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

router.get('/score/:subCompetency/subCompetency', authMiddleware,  scoreController.findAllBySubCompetency
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/score-user', authMiddleware,  scoreController.findAllByUser
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// VIDEO
router.post('/video', authMiddleware , videoController.create
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateVideoRequest"
        }
    }
    */
)
router.get('/video', videoController.findAll
    /*
    #swagger.tags = ['Video']
    */
)
router.get('/video/:id', videoController.findOne
    /*
    #swagger.tags = ['Video']
    */
)
router.delete('/video/:id', videoController.remove
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/video/:subCompetency/subCompetency', authMiddleware,  videoController.findAllBySubCompetency
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

router.post('/media/upload-single', [
    authMiddleware,
    mediaMiddleware.single('file')
], mediaController.single
    /* 
    #swagger.tags = ['Media']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        file: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
    */
)

router.post('/media/upload-multiple', [
    authMiddleware,
    mediaMiddleware.multiple('files')
], mediaController.multiple
    /*
    #swagger.tags = ['Media']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        files: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                }
            }
    }
    */
)

router.delete('/media/remove', [
    authMiddleware, 
], mediaController.remove
    /*
    #swagger.tags = ['Media']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: '#/components/schemas/RemoveMediaRequest'
        }
    }
    */
)


export default router;