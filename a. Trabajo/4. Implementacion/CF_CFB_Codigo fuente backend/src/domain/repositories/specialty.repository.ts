import { Specialty } from "@prisma/client";
import { CreateSpecialtyDto , UpdateSpecialtyDto} from "../../application/dtos/specialty.dtos";

export interface ISpecialtyRepository {
  create(data: CreateSpecialtyDto): Promise<Specialty>;
  findAll(onlyActive?: boolean): Promise<Specialty[]>; 
  findByName(name: string): Promise<Specialty | null>;
  findById(id: string): Promise<Specialty | null>;
  update(id: string, data: UpdateSpecialtyDto): Promise<Specialty>;
  deactivate(id: string): Promise<Specialty>;
}