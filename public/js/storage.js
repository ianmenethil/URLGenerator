/**
 * Storage Module
 * Handles data persistence across IndexedDB, localStorage, and cookies
 * Implements triple-redundancy for maximum reliability
 */

import { CONFIG, ERROR_MESSAGES } from './config.js';

/**
 * Request persistent storage permissions
 */
async function ensurePersistence() {
    if (navigator.storage?.persist) {
        try {
            await navigator.storage.persist();
        } catch (e) {
            console.warn('Persistent storage request failed:', e);
        }
    }
}

/**
 * Open or create IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openSettingsDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('settingsDB', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('config');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * Store value in IndexedDB
 * @param {string} key
 * @param {any} value
 */
async function idbPut(key, value) {
    try {
        const db = await openSettingsDB();
        return new Promise((res, rej) => {
            const tx = db.transaction('config', 'readwrite');
            const store = tx.objectStore('config');
            const r = store.put(value, key);
            r.onsuccess = () => res();
            r.onerror = () => rej(r.error);
        });
    } catch (error) {
        throw new Error(`IndexedDB put error: ${error.message}`);
    }
}

/**
 * Retrieve value from IndexedDB
 * @param {string} key
 * @returns {Promise<any>}
 */
async function idbGet(key) {
    try {
        const db = await openSettingsDB();
        return new Promise((res, rej) => {
            const tx = db.transaction('config', 'readonly');
            const req = tx.objectStore('config').get(key);
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    } catch (error) {
        throw new Error(`IndexedDB get error: ${error.message}`);
    }
}

/**
 * Delete value from IndexedDB
 * @param {string} key
 */
async function idbDelete(key) {
    try {
        const db = await openSettingsDB();
        return new Promise((res, rej) => {
            const tx = db.transaction('config', 'readwrite');
            const req = tx.objectStore('config').delete(key);
            req.onsuccess = () => res();
            req.onerror = () => rej(req.error);
        });
    } catch (error) {
        throw new Error(`IndexedDB delete error: ${error.message}`);
    }
}

/**
 * Store value in cookie
 * @param {string} key
 * @param {string} value
 */
function setCookie(key, value) {
    document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${CONFIG.COOKIE_MAX_AGE}; path=/; SameSite=Strict`;
}

/**
 * Retrieve value from cookie
 * @param {string} key
 * @returns {string|null}
 */
function getCookie(key) {
    const match = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
}

/**
 * Delete cookie
 * @param {string} key
 */
function deleteCookie(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Save value to all storage mechanisms
 * @param {string} key
 * @param {string} val
 */
async function saveToStores(key, val) {
    try {
        localStorage.setItem(key, val);
        setCookie(key, val);
        await idbPut(key, val);
    } catch (error) {
        throw new Error(`${ERROR_MESSAGES.STORAGE_ERROR}: ${error.message}`);
    }
}

/**
 * Load value from all storage mechanisms and sync if inconsistent
 * @param {string} key
 * @returns {Promise<string>}
 */
async function loadFromStores(key) {
    try {
        const fromIDB = await idbGet(key);
        const fromLS = localStorage.getItem(key);
        const fromCK = getCookie(key);
        const val = fromIDB || fromLS || fromCK || '';

        // Sync if values differ
        if (val) {
            if (fromLS !== val) localStorage.setItem(key, val);
            if (fromCK !== val) setCookie(key, val);
            if (fromIDB !== val) await idbPut(key, val);
        }
        return val;
    } catch (error) {
        throw new Error(`${ERROR_MESSAGES.LOAD_ERROR}: ${error.message}`);
    }
}

/**
 * Delete value from all storage mechanisms
 * @param {string} key
 */
async function deleteFromStores(key) {
    try {
        localStorage.removeItem(key);
        deleteCookie(key);
        await idbDelete(key);
    } catch (error) {
        console.error('Error deleting from stores:', error);
    }
}

/**
 * Save merchant code with maximal persistence
 * @param {string} merchantcode
 */
export async function saveMerchantCode(merchantcode) {
    try {
        await ensurePersistence();
        await saveToStores(CONFIG.STORAGE_KEY, merchantcode);
    } catch (error) {
        console.error('Failed to save merchant code:', error);
        throw error;
    }
}

/**
 * Load merchant code from storage
 * @returns {Promise<{merchantcode: string}>}
 */
export async function loadMerchantCode() {
    try {
        await ensurePersistence();
        const code = await loadFromStores(CONFIG.STORAGE_KEY);
        return { merchantcode: code };
    } catch (error) {
        console.error('Failed to load merchant code:', error);
        return { merchantcode: '' };
    }
}

/**
 * Clear all merchant code storage
 */
export async function clearMerchantStorage() {
    try {
        await deleteFromStores(CONFIG.STORAGE_KEY);
        console.log('✅ Cleared: Merchant code removed from all storage');
    } catch (error) {
        console.error('Failed to clear merchant storage:', error);
    }
}
