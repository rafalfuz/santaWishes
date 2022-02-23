import {pool} from "../utils/db";
import {ValidationError} from "../utils/errors";
import { v4 as uuidv4 } from 'uuid';

export class GiftRecord {
    constructor(obj) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 55) {
            throw new ValidationError('Nazwa prezentu musi mieć od 3 do 55 znaków.');
        }

        if (!obj.count || obj.count < 1 || obj.count > 999999) {
            throw new ValidationError('Liczba szt. prezentu powinna się mieścić w przedziale 1 - 999999.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.count = obj.count;
    }

    async insert() {
        if (!this.id) {
            this.id = uuidv4();
        }

        await pool.execute("INSERT INTO `gifts` VALUES(:id, :name, :count)", {
            id: this.id,
            name: this.name,
            count: this.count,
        });

        return this.id;
    }

    static async listAll() {
        const [results] = await pool.execute("SELECT * FROM `gifts`");
        return results.map(obj => new GiftRecord(obj));
    }

    static async getOne(id) {
        const [results] = await pool.execute("SELECT * FROM `gifts` WHERE `id` = :id", {
            id,
        });
        return results.length === 0 ? null : new GiftRecord(results[0]);
    }

    async countGivenGifts() {
        const [[{count}]] /* answer[0][0].count */ = await pool.execute("SELECT COUNT(*) AS `count` FROM `children` WHERE `giftId` = :id", {
            id: this.id,
        });
        return count;
    }
}
