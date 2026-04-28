package com.marion.wacdo.controller;

import com.marion.wacdo.dto.JobDTO;
import com.marion.wacdo.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")

public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobDTO> rechercher() {
        return jobService.rechercher();
    }

    @PostMapping
    public JobDTO create(@RequestBody JobDTO dto) {
        return jobService.create(dto);
    }


    // Mise à jour
    @PutMapping("/{id}")
    public JobDTO update(
            @PathVariable Long id,
            @RequestBody JobDTO jobDTO) {

        return jobService.update(id, jobDTO);
    }

    // Suppression
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        jobService.delete(id);
    }



}
