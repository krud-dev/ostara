package dev.krud.ostara.inappdemo.api.controller

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1")
class ApiController {
  @GetMapping("/products")
  fun getAllProducts(): List<Product> {
    return emptyList()
  }

  @GetMapping("/products/{id}")
  fun getProductById(@PathVariable id: Long): Product {
    return Product()
  }

  @PostMapping("/products")
  fun createProduct(@RequestBody(required = false) product: Product?): Product? {
    return product
  }

  @PutMapping("/products/{id}")
  fun updateProduct(@PathVariable id: Long, @RequestBody(required = false) product: Product?): Product? {
    return product
  }

  @DeleteMapping("/products/{id}")
  fun deleteProduct(@PathVariable id: Long) {
  }

  @GetMapping("/orders")
  fun getAllOrders(): List<Order> {
    return emptyList()
  }

  @GetMapping("/orders/{id}")
  fun getOrderById(@PathVariable id: Long): Order {
    return Order()
  }

  @PostMapping("/orders")
  fun createOrder(@RequestBody(required = false) order: Order?): Order? {
    return order
  }

  @PutMapping("/orders/{id}")
  fun updateOrder(@PathVariable id: Long, @RequestBody(required = false) order: Order?): Order? {
    return order
  }

  @DeleteMapping("/orders/{id}")
  fun deleteOrder(@PathVariable id: Long) {
  }

  @GetMapping("/customers")
  fun getAllCustomers(): List<Customer> {
    return emptyList()
  }

  @GetMapping("/customers/{id}")
  fun getCustomerById(@PathVariable id: Long): Customer {
    return Customer()
  }

  @PostMapping("/customers")
  fun createCustomer(@RequestBody(required = false) customer: Customer?): Customer? {
    return customer
  }

  @PutMapping("/customers/{id}")
  fun updateCustomer(@PathVariable id: Long, @RequestBody(required = false) customer: Customer?): Customer? {
    return customer
  }

  @DeleteMapping("/customers/{id}")
  fun deleteCustomer(@PathVariable id: Long) {
  }

  @GetMapping("/invoices")
  fun getAllInvoices(): List<Invoice> {
    return emptyList()
  }

  @GetMapping("/invoices/{id}")
  fun getInvoiceById(@PathVariable id: Long): Invoice {
    return Invoice()
  }

  @PostMapping("/invoices")
  fun createInvoice(@RequestBody(required = false) invoice: Invoice?): Invoice? {
    return invoice
  }

  @PutMapping("/invoices/{id}")
  fun updateInvoice(@PathVariable id: Long, @RequestBody(required = false) invoice: Invoice?): Invoice? {
    return invoice
  }

  @DeleteMapping("/invoices/{id}")
  fun deleteInvoice(@PathVariable id: Long) {
  }

  @GetMapping("/payments")
  fun getAllPayments(): List<Payment> {
    return emptyList()
  }

  @GetMapping("/payments/{id}")
  fun getPaymentById(@PathVariable id: Long): Payment {
    return Payment()
  }

  @PostMapping("/payments")
  fun createPayment(@RequestBody(required = false) payment: Payment?): Payment? {
    return payment
  }

  @PutMapping("/payments/{id}")
  fun updatePayment(@PathVariable id: Long, @RequestBody(required = false) payment: Payment?): Payment? {
    return payment
  }

  @DeleteMapping("/payments/{id}")
  fun deletePayment(@PathVariable id: Long) {
  }

  @GetMapping("/shipments")
  fun getAllShipments(): List<Shipment> {
    return emptyList()
  }

  @PostMapping("/shipments")
  fun createShipment(@RequestBody(required = false) shipment: Shipment?): Shipment? {
    return shipment
  }

  class Product
  class Shipment
  class Invoice
  class Payment
  class Customer
  class Order
}
