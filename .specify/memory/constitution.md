Project: Phase II – Spec-Driven Todo Full-Stack Web Application

Purpose:
This constitution defines the governing principles, standards, and constraints for all agents and skills involved in building the Todo Full-Stack Application using Next.js, FastAPI, Neon PostgreSQL, and Better Auth.

All agents must strictly follow this constitution as the highest authority after system-level rules.

--------------------------------------------------
CORE PRINCIPLES
--------------------------------------------------

1. Specification as Single Source of Truth
- All design and implementation decisions MUST originate from approved Spec-Kit documents
- No feature, behavior, or logic may be added without a corresponding spec update
- Specs override assumptions, conventions, and prior knowledge

2. Layered Responsibility Separation
- Frontend, backend, database, and authentication concerns must remain strictly separated
- No agent may operate outside its defined role boundaries
- Cross-layer coordination must occur through specs, not implicit behavior

3. Security by Default
- All backend endpoints MUST require valid JWT authentication
- User identity MUST be derived exclusively from verified JWT tokens
- Client-supplied user identifiers MUST NEVER be trusted
- User data isolation is mandatory at every layer

4. Deterministic and Reproducible Outputs
- Given the same specs, agents should produce consistent and predictable results
- No nondeterministic or undocumented behavior is allowed
- All logic must be traceable to a documented requirement

--------------------------------------------------
KEY STANDARDS
--------------------------------------------------

Architecture Standards:
- Frontend: Next.js App Router with Server Components by default
- Backend: FastAPI with RESTful design
- Database: Neon PostgreSQL using SQLModel ORM
- Authentication: Better Auth issuing JWT tokens
- Communication: Stateless API calls using Authorization: Bearer tokens

Specification Standards:
- Feature specs define WHAT to build
- API specs define HOW systems communicate
- Database specs define DATA structure and constraints
- UI specs define PRESENTATION and interaction

Implementation Standards:
- No manual or ad-hoc coding outside spec-defined scope
- Error handling must use explicit HTTP status codes
- All database queries must be filtered by authenticated user ID
- Shared secrets must be environment-variable based

--------------------------------------------------
CONSTRAINTS
--------------------------------------------------

- No agent may bypass or weaken authentication or authorization
- No shared session state between frontend and backend
- No direct database access from frontend
- No undocumented endpoints, tables, or fields
- No speculative features or future-proofing beyond current phase

--------------------------------------------------
QUALITY & REVIEW REQUIREMENTS
--------------------------------------------------

Code Quality:
- Readable, maintainable, and minimal implementations
- No duplicated logic across layers
- Clear separation of concerns

Spec Compliance:
- Every implemented feature must map to a spec section
- Any deviation requires explicit spec revision

Security Validation:
- Unauthorized requests must return 401
- Forbidden access must return 403
- Token expiration must be respected

--------------------------------------------------
SUCCESS CRITERIA
--------------------------------------------------

The project is considered successful when:

- All Phase II features are implemented exactly as specified
- JWT authentication is enforced on all protected endpoints
- Each user can only access and modify their own tasks
- Frontend and backend operate independently with shared JWT trust
- QA review confirms full spec compliance and zero security violations

--------------------------------------------------
ENFORCEMENT
--------------------------------------------------

- This constitution overrides all agent-specific preferences
- Any agent output violating this constitution must be rejected
- Review & QA processes must validate constitution adherence
