import {OrgSite} from '../models/org-site';

export const PROJECT_ORG_SITES: OrgSite[] = [
  {id: 'N3C', label: 'N3C Project'},
  {id: 'CTSA', label: 'CTSA'},
  {id: 'CTR', label: 'CTR'},
  {id: 'GOV', label: 'GOV'},
  {id: 'COM', label: 'COM'},
  {id: 'UNAFFILIATED', label: 'Unaffiliated'},
  {id: 'REGIONAL', label: 'Regional'}
];

export const dashboardGrid = [
  {
    id: 'Collaboration_Networks',
    title: 'Collaboration Networks',
    description: 'Explore the collaborations between individuals and institutions working on projects within the N3C.',
    image: '../n3c/images/dash_collaboration-network.png',
    link: '/dashboard/collaboration-graph/'
  },
  {
    id: 'Admin',
    title: 'Admin Panel',
    description: 'Metrics on user registrations, institutions submitting data, and groups.',
    image: '../n3c/images/dash_site_user-metrics.png',
    link: '/dashboard/admin/'
  },
  {
    id: 'Data_download',
    title: 'Data Download',
    description: 'Download data used to populate our visualizations in csv or json format.',
    image: '../n3c/images/dash_data_download.png',
    link: '/dashboard/downloads/'
  },
  {
    id: 'PPRL',
    title: 'Privacy-Preserving Record Linkage(PPRL)',
    description: 'This dashboard displays the current status of linking N3C records to other resources.',
    image: '../n3c/images/dash_pprl.jpg',
    link: '/dashboard/pprl'
  },
  {
    id: 'N3C_Teams',
    title: 'N3C Teams',
    description: 'Learn more about the teams working within the N3C Data Enclave.',
    image: '../n3c/images/dash_n3c_teams.png',
    link: '/dashboard/teams'
  },
  {
    id: 'PPRL_Enrichment',
    title: 'PPRL Enrichment',
    description:
      'This dashboard provides a snapshot of the data enrichment provided by PPRL. Explore the data added, demographics, and COVID factors by supplemental source.',
    image: '../n3c/images/dash_pprl_enhance.png',
    link: '/dashboard/pprl-enrichment/home'
  },
  {
    id: 'Institutions_Contributing_Data',
    title: 'Institutions Contributing Data',
    description:
      'Explore our institutional data partners, the data-models they utilize, and the status of their transfers.',
    image: '../n3c/images/dash_institution_data.png',
    link: '/dashboard/contributing-sites/'
  },
  {
    id: 'Demographics_Table_for_IRB',
    title: 'Demographics Table for IRB Submission',
    description:
      'This dashboard provides a downloadable snapshot of the cumulative demographic data for all patients in the Enclave.',
    image: './n3c/images/dash_demo_irb.png',
    link: '/dashboard/hss/'
  },
  {
    id: 'Site_Collaboration_Profile',
    title: 'Site Collaboration Profile',
    description: 'A by-site presentation of Enclave research collaboration.',
    image: './n3c/images/dash_collaboration_map.png',
    link: '/dashboard/collaborating-sites'
  },
  {
    id: 'Institutional_Collaboration_Map',
    title: 'Institutional Collaboration Map',
    description: 'Explore the collaborations between institutions who have researchers working with N3C Data.',
    image: '../n3c/images/dash_collaboration_map.png',
    link: '/dashboard/collaboration-map'
  },
  {
    id: 'Inter-Institutional_Publications_Map',
    title: 'Inter-Institutional Publications Map',
    description: 'Explore the institutions that have collaborated on publications involving N3C Data.',
    image: '../n3c/images/dash_inter-pubc_map.png',
    link: '/dashboard/publications-map'
  },
  {
    id: 'Site_and_User_Metrics',
    title: 'Site and User Metrics',
    description: 'Explore registration, usage, and other administrative metrics for the N3C.',
    image: '../n3c/images/dash_site_user-metrics.png',
    link: '/dashboard/users'
  },
  {
    id: 'N3C_Concept_Sets',
    title: 'N3C Concept Sets',
    description: 'The officially recommended set of concepts in use in the Enclave.',
    image: '../n3c/images/dashb_n3c_concept_sets.png',
    link: '/dashboard/concept-sets'
  },
  {
    id: 'Enclave_Health',
    title: 'Enclave Health',
    description:
      'This dashboard provides an overview of patient demographics and any comorbidities they might have. A closer focus on maternal health issues is also provided.',
    image: './n3c/images/dash_enclave_health.png',
    link: '/dashboard/enclave-health'
  },
  {
    id: 'Cumulative_and_Average_COVID_Cases',
    title: 'Cumulative and Average COVID+ Cases',
    description:
      'This dashboard displays the cumulative and average number of COVID+ cases over time, with breakdowns by demographics and other relevant factors.',
    image: '../n3c/images/dash_timeline.png',
    link: '/dashboard/timeline'
  },
  {
    id: 'Disease_Snapshots',
    title: 'Disease Snapshots',
    description:
      'This dashboard breaks down the counts of patients with select comorbidities by COVID status, the incidence in relation to COVID+ diagnosis, and demographics.',
    image: '../n3c/images/dash_diseaseSnapshot.png',
    link: '/dashboard/disease-snapshots/covid'
  }
];

export const dashboard_tiles = [
  {
    id: 'Site_and_User_Metrics',
    title: 'Site and User Metrics',
    description: 'Explore registration, usage, and other administrative metrics for the N3C.',
    image: '../n3c/images/dash_site_user-metrics.png',
    link: '/dashboard/'
  },
  {
    id: 'Regional_Distribution_of_COVID_Patients',
    title: 'Regional Distribution of COVID+ Patients',
    description:
      'This dashboard shows the regional distribution of COVID+ patients within the Enclave and the number of contributing sites in each region.',
    image: '../n3c/images/dash_regional_distribution.png',
    link: '/dashboard/'
  },
  {
    id: 'Publications',
    title: 'Publications',
    description:
      'Explore the publications, presentations, and preprints resulting from research done within the N3C Data Enclave.',
    image: '../n3c/images/dash_publications.png',
    link: '/dashboard/publications/'
  },
  {
    id: 'PPRL',
    title: 'Privacy-Preserving Record Linkage(PPRL)',
    description: 'This dashboard displays the current status of linking N3C records to other resources.',
    image: '../n3c/images/dash_pprl.jpg',
    link: '/dashboard/'
  },
  {
    id: 'PPRL_Enrichment',
    title: 'PPRL Enrichment',
    description:
      'This dashboard provides a snapshot of the data enrichment provided by PPRL. Explore the data added, demographics, and COVID factors by supplemental source.',
    image: '../n3c/images/dash_pprl_enhance.png',
    link: '/dashboard/'
  },
  {
    id: 'Paxlovid',
    title: 'Medications - Paxlovid',
    description:
      'This dashboard provides an overview of the patients prescribed Paxlovid, including demographic information, associated medications, conditions, and outcomes.',
    image: '../n3c/images/dash_paxlovid.png',
    link: '/dashboard/public-health/paxlovid/4'
  },
  {
    id: 'Metformin',
    title: 'Medications - Metformin',
    description:
      'This dashboard provides an overview of the patients prescribed Metformin, including demographic information, severity/mortality comparisons, and Long COVID information.',
    image: '../n3c/images/dash_metformin.png',
    link: '/dashboard/public-health/metformin/1'
  },
  {
    id: 'Medication_Time_Series',
    title: 'Medication Time Series',
    description:
      'This dashboard lets you explore the monthly prescription frequency of select medications associated with the treatment of COVID-19.',
    image: '../n3c/images/dash_medication_timeseries.png',
    link: '/dashboard/'
  },
  {
    id: 'Long_COVID',
    title: 'Long COVID',
    description: 'This dashboard provides a snapshot of the demographics and symptoms associated with Long COVID.',
    image: '../n3c/images/dash_long_covid.png',
    link: '/dashboard/'
  },
  {
    id: 'Medications_Snapshots',
    title: 'Medications Snapshots',
    description:
      'This dashboard breaks down the counts of COVID+ patients prescribed Sotrovimab by vaccination status,the occurrence of other comorbidities in relation to prescription, severity, and demographics.',
    image: '../n3c/images/dash_medications_snapshots.png',
    link: '/dashboard/'
  },
  {
    id: 'Medications',
    title: 'Medications',
    description: 'This dashboard provides the counts of patients prescribed select medications.',
    image: '../n3c/images/dash_medications.png',
    link: '/dashboard/'
  },
  {
    id: 'Demographics',
    title: 'Demographics',
    description:
      'Explore demographics and COVID factors associated with patients within the Enclave. Gain a general overview of all patients or target a specific cohort by associated comorbidities, vaccination/COVID status, etc.',
    image: './n3c/images/dash_demographics.png',
    link: '/dashboard/'
  },
  {
    id: 'Smoking',
    title: 'Smoking',
    description:
      'This dashboard shows the breakdown of smoking status by demographics and severity for COVID+ patients in the Enclave.',
    image: '../n3c/images/dash_smoking.png',
    link: '/dashboard/'
  },
  {
    id: 'Reinfection_Time_Series',
    title: 'Reinfection Time Series',
    description:
      'This dashboard shows the first infection dates of patients reinfected with COVID-19 in any particular month.',
    image: '../n3c/images/dash_reinfection-time-series.png',
    link: '/dashboard/'
  },
  {
    id: 'Reinfection',
    title: 'Reinfection',
    description:
      'This dashboard provides a snapshot of COVID-19 reinfection counts and reinfection intervals within the Enclave.',
    image: '../n3c/images/dash_reinfection.png',
    link: '/dashboard/'
  },
  {
    id: 'Substance_Use',
    title: 'Substance Use',
    description:
      'Explore the demographics associated with several categories of substance use (smoking, alcohol, opioids, and cannabis) within the Enclave and identify clusters of related substances.',
    image: '../n3c/images/dash_substance.png',
    link: '/dashboard/'
  },
  {
    id: 'Environmental_Factors',
    title: 'Environmental Factors',
    description:
      'Explore the demographics of patients who have been exposed to environmental factors, the frequency of environmental factor exposure, and mortality counts related to each factor.',
    image: '../n3c/images/dash_environmental.png',
    link: '/dashboard/'
  },
  {
    id: 'RECOVER_Initiative',
    title: 'RECOVER Initiative (Long COVID)',
    description:
      'This study applies machine learning techinques to N3C data to identify features of the EHR data that are predictive of Long COVID.',
    image: '../n3c/images/dash_recover.png',
    link: '/dashboard/'
  },
  {
    id: 'Collaboration_Networks',
    title: 'Collaboration Networks',
    description: 'Explore the collaborations between individuals and institutions working on projects within the N3C.',
    image: '../n3c/images/dash_collaboration-network.png',
    link: '/dashboard/collaboration-graph/'
  }
];
