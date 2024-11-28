import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchStates = async () => {
  const response = await axios.get('https://api.data.gov.in/resource/189cab67-c7fa-4e58-995c-fb467434169d', {
    params: {
      'api-key': '579b464db66ec23bdd00000162cb3b1f099c42d0579d88da6670af37',
      format: 'json',
      limit: 100000,
    },
  });
  const stateNames = response.data.records.map((record) => record.state_name);
  return [...new Set(stateNames)];
};

const fetchDistricts = async ({ queryKey }) => {
  const [, stateName] = queryKey;
  const response = await axios.get('https://api.data.gov.in/resource/189cab67-c7fa-4e58-995c-fb467434169d', {
    params: {
      'api-key': '579b464db66ec23bdd00000162cb3b1f099c42d0579d88da6670af37',
      format: 'json',
      limit: 100000,
      filters: { state_name: stateName },
    },
  });
  const districtNames = response.data.records.map((record) => record.district_name);
  return [...new Set(districtNames)].slice(1); // Remove the first result
};


const fetchSubDistricts = async ({ queryKey }) => {
  const [, districtName] = queryKey;
  const response = await axios.get('https://api.data.gov.in/resource/189cab67-c7fa-4e58-995c-fb467434169d', {
    params: {
      'api-key': '579b464db66ec23bdd00000162cb3b1f099c42d0579d88da6670af37',
      format: 'json',
      limit: 100000,
      filters: { district_name: districtName },
    },
  });
  const subDistrictNames = response.data.records.map((record) => record.sub_district_name);
  return [...new Set(subDistrictNames)];
};

const fetchVillages = async ({ queryKey }) => {
  const [, subDistrictName] = queryKey;
  const response = await axios.get('https://api.data.gov.in/resource/189cab67-c7fa-4e58-995c-fb467434169d', {
    params: {
      'api-key': '579b464db66ec23bdd00000162cb3b1f099c42d0579d88da6670af37',
      format: 'json',
      limit: 100000,
      filters: { sub_district_name: subDistrictName },
    },
  });
  const villageNames = response.data.records.map((record) => record.area_name);
  return [...new Set(villageNames)];
};

const LocationDropdown = ({ initialState = '', initialDistrict = '', initialSubDistrict = '', initialVillage = '', onStateChange, onDistrictChange, onSubDistrictChange, onVillageChange }) => {
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(initialSubDistrict);
  const [selectedVillage, setSelectedVillage] = useState(initialVillage);

  const { data: states = [], isLoading: loadingStates } = useQuery({
    queryKey: ['fetchStates'],
    queryFn: fetchStates,
    staleTime: Infinity,
  });

  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ['fetchDistricts', selectedState],
    queryFn: fetchDistricts,
    enabled: !!selectedState,
  });

  const { data: subDistricts = [], isLoading: loadingSubDistricts } = useQuery({
    queryKey: ['fetchSubDistricts', selectedDistrict],
    queryFn: fetchSubDistricts,
    enabled: !!selectedDistrict,
  });

  const { data: villages = [], isLoading: loadingVillages } = useQuery({
    queryKey: ['fetchVillages', selectedSubDistrict],
    queryFn: fetchVillages,
    enabled: !!selectedSubDistrict,
  });

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict('');
    setSelectedSubDistrict('');
    setSelectedVillage('');
    onStateChange(stateName);
  };

  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    setSelectedSubDistrict('');
    setSelectedVillage('');
    onDistrictChange(districtName);
  };

  const handleSubDistrictChange = (subDistrictName) => {
    setSelectedSubDistrict(subDistrictName);
    setSelectedVillage('');
    onSubDistrictChange(subDistrictName);
  };

  const handleVillageChange = (villageName) => {
    setSelectedVillage(villageName);
    onVillageChange(villageName);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-2">
      <FormControl fullWidth variant="outlined">
        <TextField
          select
          label={('State')}
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          name="userType"
          variant="outlined"
          size="small"
          fullWidth
          required
        >
          <MenuItem value="">Select State</MenuItem>
          {states.map((state, index) => (
            <MenuItem key={index} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <TextField
          select
          label={('District')}
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          name="userType"
          variant="outlined"
          size="small"
          fullWidth
          required
          disabled={loadingDistricts || !selectedState}
        >

          <MenuItem value="">Select District</MenuItem>
          {districts.map((district, index) => (
            <MenuItem key={index} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      <FormControl fullWidth variant="standard">
        <TextField
          select
          label={('Sub-District')}
          value={selectedSubDistrict}
          onChange={(e) => handleSubDistrictChange(e.target.value)}
          disabled={loadingSubDistricts || !selectedDistrict}
          name="userType"
          variant="outlined"
          size="small"
          fullWidth
          required
        >
          <MenuItem value="">Select Sub-District</MenuItem>
          {subDistricts.map((subDistrict, index) => (
            <MenuItem key={index} value={subDistrict}>
              {subDistrict}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      <FormControl fullWidth variant="standard">
        <TextField
          select
          label={('Village')}
          value={selectedVillage} onChange={(e) => handleVillageChange(e.target.value)} disabled={loadingVillages || !selectedSubDistrict}
          name="userType"
          variant="outlined"
          size="small"
          fullWidth
          required
        >
          <MenuItem value="">Select Village</MenuItem>
          {villages.map((village, index) => (
            <MenuItem key={index} value={village}>
              {village}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </div>
  );
};

export default LocationDropdown;
