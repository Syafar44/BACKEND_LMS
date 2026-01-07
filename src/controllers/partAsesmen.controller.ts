import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import PartAsesmenModel, { partAsesmenDAO } from "../models/partAsesmen.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await partAsesmenDAO.validate(req.body)
            const result = await PartAsesmenModel.create(req.body)
            response.success(res, result, "Success create Part Asesmen")
        } catch (error) {
            response.error(res, error, "Failed create Part Asesmen")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 9999, search } = req.query as unknown as IPaginationQuery
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

            const result = await PartAsesmenModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await PartAsesmenModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Part Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find all Part Asesmen")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Part Asesmen");
            }
            
            const result = await PartAsesmenModel.findById(id)
            response.success(res, result, "Success find a Part Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find a Part Asesmen")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Part Asesmen");
                }
                
                const result = await PartAsesmenModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Part Asesmen")
            } catch (error) {
                response.error(res, error, "Failed update Part Asesmen")
            }
        } catch (error) {
            response.error(res, error, "Failed update Part Asesmen")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Part Asesmen");
            }
            
                const result = await PartAsesmenModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Part Asesmen")
        } catch (error) {
            response.error(res, error, "Failed remove Part Asesmen")
        }
    },
    async findOneByProtId(req: IReqUser, res: Response) {
        try {
            const { protector_id } = req.params;
            const result = await PartAsesmenModel.findOne({
                protector_id,
            });
        
            if (!result) return response.notFound(res, "Asesmen not found");
        
            response.success(res, result, "Success find one by protector id an Part Asesmen");
        } catch (error) {
            response.error(res, error, "Failed find one by protector id an Part Asesmen");
        }
    },
}