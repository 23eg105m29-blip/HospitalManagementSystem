package com.hospital.controller;

import com.hospital.entity.Prescription;
import com.hospital.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @PostMapping
    public Prescription addPrescription(@RequestBody Prescription prescription) {
        if (prescription.getPrescriptionDate() == null) {
            prescription.setPrescriptionDate(LocalDateTime.now());
        }
        return prescriptionRepository.save(prescription);
    }

    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable Long id) {
        prescriptionRepository.deleteById(id);
    }
}
