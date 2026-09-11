\# System Architecture



\## 1. Project Overview



The Land Acquisition AI system is an AI-based decision-support solution designed to predict the risk of delay in land acquisition projects.



The system uses historical and project-specific information such as land area, affected families, approval delays, legal disputes, rehabilitation progress, stakeholder responsiveness, and historical performance to estimate whether a project is likely to be delayed.



The system provides:



\- Delay risk prediction

\- Risk score between 0 and 1

\- Risk category: Low, Medium, or High

\- Predicted delay status

\- What-If analysis

\- District-wise and state-wise analytics

\- Project-type comparison

\- Explainability support for understanding important factors



\---



\## 2. High-Level Architecture



The overall system follows this flow:



```text

User / Frontend

&#x20;     |

&#x20;     v

Backend / API

&#x20;     |

&#x20;     v

Input Validation

&#x20;     |

&#x20;     v

ML Preprocessing Pipeline

&#x20;     |

&#x20;     v

XGBoost Classification Model

&#x20;     |

&#x20;     v

Risk Score + Risk Category

&#x20;     |

&#x20;     +--------------------+

&#x20;     |                    |

&#x20;     v                    v

What-If Analysis       Analytics

&#x20;     |                    |

&#x20;     +---------+----------+

&#x20;               |

&#x20;               v

&#x20;         Results / Dashboard

