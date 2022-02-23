import {pool} from "../utils/db";
import {ValidationError} from "../utils/errors";
import { v4 as uuidv4 } from 'uuid';


export class ChildRecord {
    id: number
    name: string
    giftId: number
    
    constructor(obj) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 25) {
            throw new ValidationError('Imię musi mieć od 3 do 25 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.giftId = obj.giftId;
    }
    async insert() {
        if (!this.id) {
            this.id = uuidv4();
        }

        await pool.execute("INSERT INTO `children`(`id`, `name`) VALUES(:id, :name)", {
            id: this.id,
            name: this.name,
        });

        return this.id;
    }

    static async listAll() {
        const [results] = await pool.execute("SELECT * FROM `children` ORDER BY `name` ASC");
        return results.map(obj => new ChildRecord(obj));
    }

    static async getOne(id) {
        const [results] = await pool.execute("SELECT * FROM `children` WHERE `id` = :id", {
            id,
        });
        return results.length === 0 ? null : new ChildRecord(results[0]);
    }

    async update() {
        await pool.execute("UPDATE `children` SET `name` = :name, `giftId` = :giftId WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            giftId: this.giftId,
        });
    }
}

