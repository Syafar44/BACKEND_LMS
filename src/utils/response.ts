import { Response } from "express"
import mongoose from "mongoose"

import * as Yup from "yup"

type Pagination = {
    totalPages: number,
    current: number,
    total: number,
}

export default {
    success(res: Response, data: any, message: string) {
        res.status(200).json({
            meta: {
                status: 200,
                message
            },
            data
        })
    },
    error(res: Response, error: unknown, message: string) {
        if(error instanceof Yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message
                },
                data: {
                    [`${error.path}`]: error.errors[0],
                }
            })
        }

        if (error instanceof mongoose.Error) {
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: error.message
                },
                data: error.name,
            })
        }

        if ((error as any)?.code) {
            const _err = error as any
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: _err.errorResponse
                },
                data: _err
            })
        }

        res.status(500).json({
            meta: {
                status: 500,
                message
            },
            data: error
        })
    },
    notFound(res: Response, message: string = "not found") {
        res.status(404).json({
          meta: {
            status: 404,
            message,
          },
          data: null,
        });
      },
    unauthorized(res: Response, message: string = "unauthorize") {
        res.status(403).json({
            meta: {
                status: 403,
                message
            },
            data: null
        })
    },
    pagination(res: Response, data: any[], pagination: Pagination, message: string) {
        res.status(200).json({
            meta: {
                status: 200,
                message
            },
            data,
            pagination
        })
    }
}