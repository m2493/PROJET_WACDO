package com.marion.wacdo.service;

import com.marion.wacdo.dto.JobDTO;
import com.marion.wacdo.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class JobServiceImplIntegrationTest {

    @Autowired
    private JobService jobService;

    @Autowired
    private JobRepository jobRepository;

    /*@Test
    void shouldCreateJob() {
        JobDTO dto = new JobDTO();
        dto.setLabelFunction("Serveur");

        JobDTO result = jobService.create(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getLabelFunction()).isEqualTo("Serveur");
    }

    @Test
    void shouldFindAllJobs() {
        JobDTO dto = new JobDTO();
        dto.setName("Manager");

        jobService.create(dto);

        List<JobDTO> jobs = jobService.rechercher();

        assertThat(jobs).isNotEmpty();
    }

    @Test
    void shouldUpdateJob() {
        JobDTO dto = new JobDTO();
        dto.setName("Old Job");

        JobDTO created = jobService.create(dto);

        JobDTO updatedDto = new JobDTO();
        updatedDto.setName("New Job");

        JobDTO result = jobService.update(created.getId(), updatedDto);

        assertThat(result.getName()).isEqualTo("New Job");
    }

    @Test
    void shouldDeleteJob() {
        JobDTO dto = new JobDTO();
        dto.setName("ToDelete");

        JobDTO created = jobService.create(dto);

        jobService.delete(created.getId());

        assertThat(jobRepository.findById(created.getId())).isEmpty();
    }*/
}

