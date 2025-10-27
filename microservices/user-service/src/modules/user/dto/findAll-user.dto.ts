import { IsNumber, IsPositive, IsString } from "class-validator";
export class FindAllUserDto {
    @IsPositive()
    page: number;
    @IsPositive()
    limit: number;
    @IsString()
    search?: string;
}
