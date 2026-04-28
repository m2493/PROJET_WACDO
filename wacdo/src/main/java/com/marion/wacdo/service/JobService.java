package com.marion.wacdo.service;

import com.marion.wacdo.dto.CollaboratorDTO;
import com.marion.wacdo.dto.JobDTO;

import java.util.List;

public interface JobService {

    List<JobDTO> rechercher();

    JobDTO create(JobDTO dto);

    JobDTO update(Long id, JobDTO dto);

    public void delete(Long id);
}
