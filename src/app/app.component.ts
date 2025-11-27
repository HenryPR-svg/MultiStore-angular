// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from './models';
import { ProductService } from './product.service';
import { CartService } from './cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MultiStore';

  // Slider con 3 imágenes de internet
sliderImages: string[] = [
  'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg', 
  'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg', 
  'https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg'  
];

  currentSlide = 0;

  // Filtros
  categories: string[] = [];
  selectedCategory = 'Todos';
  searchTerm = '';

  // Productos
  products: Product[] = [];

  // Modales / carrito
  selectedProduct: Product | null = null;
  showProductModal = false;
  showCartModal = false;
  successMessage = '';

  // 👇 ESTA ES LA QUE FALTABA
  quantityToAdd = 1;

  // Estados
  loadingProducts = false;
  loadingCategories = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // ========== SLIDER ==========
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.sliderImages.length) % this.sliderImages.length;
  }

  // ========== CATEGORÍAS Y PRODUCTOS ==========
  loadCategories(): void {
    this.loadingCategories = true;
    this.productService.getCategories().subscribe({
      next: cats => {
        this.categories = ['Todos', ...cats];
        this.selectedCategory = 'Todos';
        this.loadProducts();
        this.loadingCategories = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Error cargando categorías';
        this.loadingCategories = false;
      }
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getProductsByCategory(this.selectedCategory).subscribe({
      next: prods => {
        this.products = prods;
        this.loadingProducts = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Error cargando productos';
        this.loadingProducts = false;
      }
    });
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p =>
      p.title.toLowerCase().includes(term)
    );
  }

  // ========== MODAL PRODUCTO ==========
  openProduct(product: Product): void {
    this.selectedProduct = product;
    this.showProductModal = true;
    this.successMessage = '';
    this.quantityToAdd = 1; // reiniciar a 1
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
    this.successMessage = '';
  }

  addSelectedToCart(): void {
    if (!this.selectedProduct) {
      return;
    }

    if (this.quantityToAdd < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    this.cartService.addToCart(this.selectedProduct, this.quantityToAdd);
    this.successMessage =
      this.quantityToAdd === 1
        ? 'Producto agregado al carrito'
        : `${this.quantityToAdd} unidades agregadas al carrito`;
  }

  // ========== CARRITO ==========
  openCart(): void {
    this.showCartModal = true;
  }

  closeCart(): void {
    this.showCartModal = false;
  }

  clearCart(): void {
    if (this.cartService.getItems().length === 0) {
      alert('El carrito ya está vacío');
      return;
    }

    const confirmar = confirm('¿Deseas vaciar todo el carrito?');
    if (confirmar) {
      this.cartService.clearCart();
    }
  }

  pay(): void {
    if (this.cartService.getItems().length === 0) {
      alert('El carrito está vacío');
      return;
    }
    alert('Pago realizado con éxito. ¡Gracias por su compra!');
    this.cartService.clearCart();
    this.closeCart();
  }

  // ========== UTILIDADES ==========
  formatCurrency(value: number): string {
    return '$' + value.toFixed(2);
  }
}
