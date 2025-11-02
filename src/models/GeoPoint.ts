import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './User';

@Table({
    tableName: 'geo_points',
    timestamps: true,
})
export class GeoPoint extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    geopointid!: string;

    @Column({
        type: DataType.DECIMAL(10, 8),
        allowNull: false,
        validate: {
            min: -90,
            max: 90,
        },
    })
    latitude!: number;

    @Column({
        type: DataType.DECIMAL(11, 8),
        allowNull: false,
        validate: {
            min: -180,
            max: 180,
        },
    })
    longitude!: number;

    @Column({
        type: DataType.ENUM('accidente', 'congestión', 'obstrucción', 'otro'),
        allowNull: false,
    })
    type!: 'accidente' | 'congestión' | 'obstrucción' | 'otro';

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string;

    @Column({
        type: DataType.GEOMETRY('POINT', 4326),
        allowNull: true,
    })
    geom?: object;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userid!: string;

    @BelongsTo(() => User)
    user!: User;
}