import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import CertificateModel, { certificateDAO, TCertificate } from "../models/certificate.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {...req.body, createdBy: userId} as TCertificate
            await certificateDAO.validate(payload)
            const result = await CertificateModel.create(payload)
            response.success(res, result, "Success create certificate")
        } catch (error) {
            response.error(res, error, "Failed create certificate")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery
        try {
            const query = {}
            
            if(search) {
                Object.assign(query, {
                    $or: [
                        {
                            title: { $regex: search, $options: 'i' },
                        },
                        {
                            description: { $regex: search, $options: 'i' },
                        }
                    ],
                })
            }

            const result = await CertificateModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await CertificateModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all certificate")
        } catch (error) {
            response.error(res, error, "Failed find all certificate")
        }
    },
    async findOneById(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            const result = await CertificateModel.find({id}).populate("createdBy competency")

            response.success(res, result, "Success find a certificate")
        } catch (error) {
            response.error(res, error, "Failed find a certificate")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a certificate");
            }
            
                const result = await CertificateModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove certificate")
        } catch (error) {
            response.error(res, error, "Failed remove certificate")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        const { page = 1, limit = 10 } = req.query as unknown as IPaginationQuery;
        
        try {
            const userId = req.user?.id;

            const query = { createdBy: userId };

            const result = await CertificateModel.find(query).populate('competency').limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec();
            const count =  await CertificateModel.countDocuments(query)

            response.pagination(res, result,{
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find certificate");
        } catch (error) {
            response.error(res, error, "Failed to find save")
        }
    },

}