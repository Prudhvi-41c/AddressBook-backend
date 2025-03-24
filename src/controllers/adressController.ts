import { Request } from "express";
import { PoolClient } from "pg"; // Import PoolClient from pg
import { db } from "../db/dbConfig";
import { Address } from "../types";
import { log } from "console";

async function addAddress(data: Address,userId:number): Promise<Address> {
    const { area1, area2, city, email, fullname, landmark, mobilenumber, pincode, state, title } = data;
    const query = `
        INSERT INTO addresses (title, fullname, mobilenumber,email, pincode, area1, area2, landmark, city, state,user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11)
        RETURNING *
    `;
    const values = [title, fullname, mobilenumber, email,pincode, area1, area2, landmark, city, state,userId];
    try {
        const result = await db.query(query, values);
        console.log(result.rows[0]);
        
        return result.rows[0];
    } catch (error) {
        console.error("Error adding address to database:", error);
        throw error; 
    }
}

async function getAllAddresses(userId:number): Promise<Address[]> {
    const query = `SELECT * FROM addresses where user_id=$1`;
    const values=[userId]
    try {
        const result = await db.query(query,values);
        return result.rows;
    } catch (error) {
        console.error("Error getting all addresses from database:", error);
        throw error;
    }
}

async function getAddressById(id:number,userId:number): Promise<Address | null> {
    const query = `SELECT * FROM addresses WHERE id = $1 and user_id=$2`;
    const values = [id,userId];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error getting address by ID from database:", error);
        throw error;
    }
}

async function updateAddressById(id1: string, data: Address,userId:number): Promise<Address | null> {
    const { area1, area2, city,email, fullname,landmark, mobilenumber, pincode, state, title } = data;
    const query = `
        UPDATE addresses
        SET title = $1, fullname = $2, mobilenumber = $3,email=$4, pincode = $5, area1 = $6, area2 = $7, landmark = $8, city = $9, state = $10
        WHERE id = $11 and user_id=$12
        RETURNING *
    `;
    const values = [title, fullname,mobilenumber,email,pincode, area1, area2, landmark, city, state, Number(id1),userId];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error updating address in database:", error);
        throw error;
    }
}

async function deleteAddressById(id:number,userId:number): Promise<Address | null> {
    const query = `DELETE FROM addresses WHERE id = $1 and user_id=$2 RETURNING *`;
    const values = [id,userId];
    try {
        const result = await db.query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error deleting address from database:", error);
        throw error;
    }
}

export { addAddress, getAllAddresses, getAddressById, updateAddressById, deleteAddressById };