import * as bcrypt from 'bcryptjs';
import { BeforeCreate, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { GeoPoint } from './GeoPoint';

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    userid!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 50],
        },
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 255],
        },
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
             len: [6, 100],
        },
    })
    email?: string;

    @HasMany(() => GeoPoint)
    geoPoints!: GeoPoint[];

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 12);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}