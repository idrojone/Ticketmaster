import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly STORAGE_KEY = 'cart-items';
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

    constructor() {
        this.loadCartFromStorage();
    }

    /**
     * Load cart items from localStorage
     */
    private loadCartFromStorage(): void {
        try {
            const storedItems = localStorage.getItem(this.STORAGE_KEY);
            if (storedItems) {
                const items = JSON.parse(storedItems) as CartItem[];
                this.cartItemsSubject.next(items);
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cartItemsSubject.next([]);
        }
    }

    /**
     * Save cart items to localStorage
     */
    private saveCartToStorage(items: CartItem[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
            this.cartItemsSubject.next(items);
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    /**
     * Get all cart items
     */
    getCartItems(): CartItem[] {
        return this.cartItemsSubject.value;
    }

    /**
     * Add item to cart or update quantity if already exists
     */
    addItem(item: CartItem): void {
        const currentItems = this.getCartItems();
        const existingItemIndex = currentItems.findIndex(
            i => i.id === item.id && i.type === item.type
        );

        if (existingItemIndex > -1) {
            // Item already exists, update quantity
            currentItems[existingItemIndex].cantidad += item.cantidad;
        } else {
            // Add new item
            currentItems.push(item);
        }

        this.saveCartToStorage(currentItems);
    }

    /**
     * Update item quantity
     */
    updateQuantity(itemId: string, type: 'concierto' | 'merchandising', cantidad: number): void {
        const currentItems = this.getCartItems();
        const itemIndex = currentItems.findIndex(
            i => i.id === itemId && i.type === type
        );

        if (itemIndex > -1) {
            if (cantidad <= 0) {
                // Remove item if quantity is 0 or less
                currentItems.splice(itemIndex, 1);
            } else {
                currentItems[itemIndex].cantidad = cantidad;
            }
            this.saveCartToStorage(currentItems);
        }
    }

    /**
     * Remove item from cart
     */
    removeItem(itemId: string, type: 'concierto' | 'merchandising'): void {
        const currentItems = this.getCartItems();
        const filteredItems = currentItems.filter(
            i => !(i.id === itemId && i.type === type)
        );
        this.saveCartToStorage(filteredItems);
    }

    /**
     * Clear all items from cart
     */
    clearCart(): void {
        this.saveCartToStorage([]);
    }

    /**
     * Get total price of all items in cart
     */
    getTotal(): number {
        const items = this.getCartItems();
        return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    /**
     * Get total number of items in cart
     */
    getItemCount(): number {
        const items = this.getCartItems();
        return items.reduce((count, item) => count + item.cantidad, 0);
    }
}
