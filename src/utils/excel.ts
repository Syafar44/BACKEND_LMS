// utils/excelUtils.ts
import * as XLSX from 'xlsx';
import { TRegister } from '../controllers/auth.controller';

export const readUsersFromExcelBuffer = async (buffer: Buffer): Promise<TRegister[]> => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return data.map((item) => ({
        fullName: item.fullName || item["Full Name"],
        email: item.email || item["Email"],
        access: item.access || item["Access"],
        job: item.access || item["Job"],
        password: item.password || item["Password"],
        confirmPassword: item.confirmPassword || item["Confirm Password"],
    }));
};
