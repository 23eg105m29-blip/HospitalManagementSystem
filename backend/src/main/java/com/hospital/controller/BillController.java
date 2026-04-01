package com.hospital.controller;

import com.hospital.entity.Bill;
import com.hospital.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @PostMapping
    public Bill addBill(@RequestBody Bill bill) {
        if (bill.getBillingDate() == null) {
            bill.setBillingDate(LocalDateTime.now());
        }
        if (bill.getStatus() == null) {
            bill.setStatus("UNPAID");
        }
        return billRepository.save(bill);
    }

    @PutMapping("/{id}")
    public Bill updateBill(@PathVariable Long id, @RequestBody Bill billDetails) {
        Bill bill = billRepository.findById(id).orElseThrow();
        bill.setStatus(billDetails.getStatus());
        bill.setTotalAmount(billDetails.getTotalAmount());
        bill.setDescription(billDetails.getDescription());
        bill.setPaymentMethod(billDetails.getPaymentMethod());
        bill.setBillType(billDetails.getBillType());
        return billRepository.save(bill);
    }

    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Long id) {
        billRepository.deleteById(id);
    }
}
