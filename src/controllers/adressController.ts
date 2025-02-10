import { Request } from "express";
import { PoolClient } from "pg"; // Import PoolClient from pg
import { db } from "../db/dbConfig";

interface Address {
    id?: number;
    title: string;
    fullname: string;
    mobilenumber: number;
    pincode: number;
    area1: string;
    area2: string;
    landmark: string;
    city: string;
    state: string;
}

async function addAddress(data: Address): Promise<Address> {
    const { area1, area2, city, fullname, landmark, mobilenumber, pincode, state, title } = data;
    const query = `
        INSERT INTO addresses (title, fullname, mobilenumber, pincode, area1, area2, landmark, city, state)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const values = [title, fullname, Number(mobilenumber), Number(pincode), area1, area2, landmark, city, state];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error adding address to database:", error);
        throw error; 
    }
}

async function getAllAddresses(): Promise<Address[]> {
    const query = `SELECT * FROM addresses`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error getting all addresses from database:", error);
        throw error;
    }
}

async function getAddressById(id:number): Promise<Address | null> {
    const query = `SELECT * FROM addresses WHERE id = $1`;
    const values = [id];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error getting address by ID from database:", error);
        throw error;
    }
}

async function updateAddressById(id1: string, data: Address): Promise<Address | null> {
    const { area1, area2, city, fullname, id,landmark, mobilenumber, pincode, state, title } = data;
    const query = `
        UPDATE addresses
        SET title = $1, fullname = $2, mobilenumber = $3, pincode = $4, area1 = $5, area2 = $6, landmark = $7, city = $8, state = $9
        WHERE id = $10
        RETURNING *
    `;
    const values = [title, fullname, Number(mobilenumber), Number(pincode), area1, area2, landmark, city, state,id];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error updating address in database:", error);
        throw error;
    }
}

async function deleteAddressById(id:number): Promise<Address | null> {
    const query = `DELETE FROM addresses WHERE id = $1 RETURNING *`;
    const values = [id];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error deleting address from database:", error);
        throw error;
    }
}

export { addAddress, getAllAddresses, getAddressById, updateAddressById, deleteAddressById };