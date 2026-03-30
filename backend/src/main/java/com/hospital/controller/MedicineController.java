package com.hospital.controller;

import com.hospital.entity.Medicine;
import com.hospital.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine medicineDetails) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow();
        medicine.setName(medicineDetails.getName());
        medicine.setCategory(medicineDetails.getCategory());
        medicine.setStockQuantity(medicineDetails.getStockQuantity());
        medicine.setUnitPrice(medicineDetails.getUnitPrice());
        medicine.setManufacturer(medicineDetails.getManufacturer());
        return medicineRepository.save(medicine);
    }

    @DeleteMapping("/{id}")
    public void deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
    }
}
