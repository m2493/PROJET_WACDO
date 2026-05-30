package com.marion.wacdo.service;

import com.marion.wacdo.dto.JobDTO;
import com.marion.wacdo.entities.Job;
import com.marion.wacdo.repository.JobRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JobServiceImplIntegrationTest {
    @Autowired
    private JobService jobService;

    @Autowired
    private JobRepository jobRepository;

    private Job job1;
    private Job job2;

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();

        job1 = createJob("Serveur");
        job2 = createJob("Cuisinier");
    }

    private Job createJob(String title) {
        Job job = new Job();
        job.setLabelFunction(title);

        Job saved = jobRepository.save(job);
        assertNotNull(saved.getId());

        return saved;
    }

    @Test
    void shouldCreateJob() {

        JobDTO dto = new JobDTO();
        dto.setLabelFunction("Manager");

        JobDTO result = jobService.create(dto);

        assertNotNull(result);
        assertEquals("Manager", result.getLabelFunction());

        List<Job> jobs = jobRepository.findAll();
        assertEquals(3, jobs.size());
    }

    @Test
    void shouldUpdateJob() {

        JobDTO dto = new JobDTO();
        dto.setLabelFunction("Chef cuisinier");

        JobDTO updated = jobService.update(job1.getId(), dto);

        assertEquals("Chef cuisinier", updated.getLabelFunction());

        Job entity = jobRepository.findById(job1.getId()).orElseThrow();
        assertEquals("Chef cuisinier", entity.getLabelFunction());
    }

    @Test
    void shouldDeleteJob() {

        jobService.delete(job1.getId());

        assertFalse(jobRepository.existsById(job1.getId()));
    }

    @Test
    void shouldReturnAllJobs() {

        List<JobDTO> result = jobService.rechercher();

        assertEquals(2, result.size());
    }

}