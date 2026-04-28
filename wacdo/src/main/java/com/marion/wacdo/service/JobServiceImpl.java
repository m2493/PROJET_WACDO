package com.marion.wacdo.service;

import com.marion.wacdo.dto.JobDTO;
import com.marion.wacdo.entities.Job;
import com.marion.wacdo.repository.JobRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final ModelMapper modelMapper;

    public JobServiceImpl(JobRepository jobRepository, ModelMapper modelMapper) {
        this.jobRepository = jobRepository;
        this.modelMapper = modelMapper;
    }

     public List<JobDTO> rechercher() {
        return jobRepository.findAll()
                .stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .toList();
    }


    @Override
    public JobDTO create(JobDTO jobDTO) {
        Job job = modelMapper.map(jobDTO, Job.class); // DTO -> Entité
        Job savedJob = jobRepository.save(job);          // Enregistre en base
        return modelMapper.map(savedJob, JobDTO.class); // Entité -> DTO
    }

    // Mise à jour
    // Mise à jour
    @Override
    @Transactional
    public JobDTO update(Long id, JobDTO jobDTO) {

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job introuvable avec l'id : " + id));

        // copie les champs du DTO vers l'entité existante
        modelMapper.map(jobDTO, existingJob);

        Job updatedJob = jobRepository.save(existingJob);

        return modelMapper.map(updatedJob, JobDTO.class);
    }

    // Suppression
    @Override
    public void delete(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job introuvable avec l'id : " + id));

        jobRepository.delete(job);
    }


}
