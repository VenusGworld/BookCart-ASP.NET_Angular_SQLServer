import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shoppingcart';
import { CartService } from 'src/app/services/cart.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit {
  public cartItems: ShoppingCart[];
  userId;
  totalPrice: number;

  constructor(
    private cartService: CartService,
    private snackBarService: SnackbarService,
    private userService: UserService) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.cartItems = [];
    this.getShoppingCartItems();
  }

  getShoppingCartItems() {
    this.cartService.getCartItems(this.userId).subscribe(
      (result: ShoppingCart[]) => {
        this.cartItems = result;
        this.getTotalPrice();
      }, error => {
        console.log('Error ocurred while fetching shopping cart item : ', error);
      });
  }

  getTotalPrice() {
    this.totalPrice = 0;
    this.cartItems.forEach(item => {
      this.totalPrice += (item.book.price * item.quantity);
    });
  }

  deleteCartItem(bookId: number) {
    this.cartService.removeCartItems(this.userId, bookId).subscribe(
      result => {
        this.userService.cartItemcount$.next(result);
        this.snackBarService.showSnackBar('Product removed from cart');
        this.getShoppingCartItems();
      }, error => {
        console.log('Error ocurred while deleting cart item : ', error);
      });
  }

  addToCart(bookId: number) {
    this.cartService.addBookToCart(this.userId, bookId).subscribe(
      result => {
        this.userService.cartItemcount$.next(result);
        this.snackBarService.showSnackBar('One item added to cart');
        this.getShoppingCartItems();
      }, error => {
        console.log('Error ocurred while addToCart data : ', error);
      });
  }

  deleteOneCartItem(bookId: number) {
    this.cartService.deleteOneCartItem(this.userId, bookId).subscribe(
      result => {
        this.userService.cartItemcount$.next(result);
        this.snackBarService.showSnackBar('One item removed from cart');
        this.getShoppingCartItems();
      }, error => {
        console.log('Error ocurred while fetching book data : ', error);
      });
  }

  clearCart() {
    this.cartService.clearCart(this.userId).subscribe(
      result => {
        this.userService.cartItemcount$.next(result);
        this.snackBarService.showSnackBar('Cart cleared!!!');
        this.getShoppingCartItems();
      }, error => {
        console.log('Error ocurred while deleting cart item : ', error);
      });
  }
}
