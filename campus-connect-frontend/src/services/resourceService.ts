import api from './api';

export interface ResourceUnit {
  unitTitle: string;
  topics: string[];
  content: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  subject: string;
  courseName?: string;
  category: string;
  fileUrl: string;
  uploaderName: string;
  createdAt: string;
  notesContent?: string;
  units?: ResourceUnit[];
}

const LOCAL_STORAGE_KEY = 'campus_connect_resources';

export const DSA_UNITS: ResourceUnit[] = [
  {
    unitTitle: 'Unit 1: Foundations & Asymptotic Complexity',
    topics: ['Big-O, Omega, Theta Notations', 'Time & Space Complexity', 'Static & Dynamic Arrays'],
    content: `1. Definition of Data Structure:
A specialized format for organizing, storing, retrieving, and manipulating data efficiently.

2. Asymptotic Notations:
• Big-O (O): Upper bound (worst-case scenario).
• Big-Omega (Ω): Lower bound (best-case scenario).
• Big-Theta (Θ): Tight bound (average-case scenario).

3. Common Time Complexities:
• O(1) - Constant: Hash table lookup, Array index access.
• O(log n) - Logarithmic: Binary Search, Balanced BST lookup.
• O(n) - Linear: Linear search, traversing an array.
• O(n log n) - Linearithmic: Merge Sort, Quick Sort (average).
• O(n²) - Quadratic: Bubble Sort, Selection Sort, nested loops.

4. Array Memory Layout:
Address(A[i]) = BaseAddress + (i * ElementSize)
Insertion at end: O(1) amortized
Insertion at index k: O(n) due to shifting`
  },
  {
    unitTitle: 'Unit 2: Linear Structures (Stacks, Queues, Lists)',
    topics: ['Singly & Doubly Linked Lists', 'Stack LIFO Operations', 'Queue FIFO Operations', 'Circular Queue'],
    content: `1. Linked List vs Array:
• Dynamic size allocation without contiguous memory constraint.
• Singly Linked List: node has data and next pointer.
• Doubly Linked List: node has prev, data, and next pointer.
• Node insertion at head: O(1) time.

2. Stack (LIFO - Last In, First Out):
• Push(x): Inserts element on top [O(1)]
• Pop(): Removes and returns top element [O(1)]
• Peek(): Inspects top without removal [O(1)]
• Applications: Expression evaluation (Infix to Postfix), browser history back-button, recursion call stack.

3. Queue (FIFO - First In, First Out):
• Enqueue(x): Inserts at rear [O(1)]
• Dequeue(): Removes from front [O(1)]
• Circular Queue avoids memory wastage by connecting rear back to front using modulo arithmetic: (rear + 1) % capacity.`
  },
  {
    unitTitle: 'Unit 3: Hierarchical Structures (Trees & BST)',
    topics: ['Binary Trees', 'Binary Search Tree (BST)', 'Tree Traversals', 'AVL Balanced Trees'],
    content: `1. Binary Tree Fundamentals:
• Maximum nodes at level i = 2^i
• Maximum nodes in tree of height h = 2^(h+1) - 1

2. Binary Search Tree (BST) Invariant:
For every node N:
• All keys in left subtree < key(N)
• All keys in right subtree > key(N)
• Search, Insert, Delete: O(h) where h is height (O(log n) if balanced, O(n) if skewed).

3. Tree Traversals:
• In-Order (Left -> Root -> Right): Always produces values in sorted ascending order!
• Pre-Order (Root -> Left -> Right): Useful for tree serialization and copying.
• Post-Order (Left -> Right -> Root): Used for bottom-up computation and node deletion.

4. Self-Balancing AVL Tree:
Balance Factor = Height(Left) - Height(Right) ∈ {-1, 0, 1}
Four rotation types to restore balance: LL, RR, LR, RL.`
  },
  {
    unitTitle: 'Unit 4: Graph Algorithms & Traversals',
    topics: ['Adjacency Matrix & List', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra Shortest Path'],
    content: `1. Graph Representations:
• Adjacency Matrix: V x V 2D matrix. Fast edge verification O(1), but requires O(V²) space.
• Adjacency List: Array of lists. Optimal space O(V + E) for sparse graphs.

2. Graph Traversals:
• BFS (Breadth-First Search):
  - Uses a FIFO Queue.
  - Explores level by level.
  - Finds shortest path in unweighted graphs.
  - Time: O(V + E).
• DFS (Depth-First Search):
  - Uses recursion or explicit LIFO Stack.
  - Explores deep along branches before backtracking.
  - Used for cycle detection and topological sorting.
  - Time: O(V + E).

3. Dijkstra Single-Source Shortest Path:
• Greedy strategy using Min-Priority Queue.
• Finds minimum distance from source to all vertices with non-negative edge weights.
• Time: O((V + E) log V).`
  },
  {
    unitTitle: 'Unit 5: Sorting, Searching & Dynamic Programming',
    topics: ['Binary Search', 'Merge Sort vs Quick Sort', 'Dynamic Programming Principles', '0/1 Knapsack'],
    content: `1. Divide & Conquer Sorting:
• Merge Sort:
  - Divides array into halves, sorts recursively, merges in O(n).
  - Time: O(n log n) in all cases (Best, Average, Worst).
  - Stable sorting algorithm, requires O(n) auxiliary space.
• Quick Sort:
  - Selects pivot, partitions array such that left <= pivot <= right.
  - Time: Average O(n log n), Worst O(n²) if pivot poorly chosen.
  - In-place sorting algorithm (Space O(log n) stack).

2. Dynamic Programming (DP):
Core requirements:
1. Optimal Substructure (Optimal solution contains optimal solutions to subproblems).
2. Overlapping Subproblems (Subproblems solved multiple times).

Approaches:
• Top-Down with Memoization (Recursive with caching).
• Bottom-Up with Tabulation (Iterative table-filling).
Examples: Fibonacci, 0/1 Knapsack Problem, Longest Common Subsequence (LCS).`
  }
];

export const DBMS_UNITS: ResourceUnit[] = [
  {
    unitTitle: 'Unit 1: Relational Model & Architecture',
    topics: ['Three-Schema Architecture', 'Data Independence', 'Entity-Relationship (ER) Model', 'Relational Keys'],
    content: `1. Database System Architecture:
• Physical / Internal Level: How data is stored on disk (B-trees, hashing).
• Conceptual / Logical Level: What data is stored (tables, schemas, relationships).
• External / View Level: User-tailored perspective.

2. Relational Keys:
• Super Key: Attribute set uniquely identifying a tuple.
• Candidate Key: Minimal super key with no extraneous attributes.
• Primary Key: Candidate key chosen to uniquely identify records; cannot be NULL.
• Foreign Key: Attribute referencing primary key of another table, ensuring referential integrity.`
  },
  {
    unitTitle: 'Unit 2: Structured Query Language (SQL)',
    topics: ['DDL, DML, DCL, TCL', 'SQL Joins', 'Nested Subqueries', 'Grouping & Aggregates'],
    content: `1. SQL Sub-languages:
• DDL: CREATE, ALTER, DROP, TRUNCATE
• DML: INSERT, UPDATE, DELETE, SELECT
• TCL: COMMIT, ROLLBACK, SAVEPOINT

2. SQL Joins Explained:
• INNER JOIN: Matches rows present in both tables.
• LEFT JOIN: Returns all rows from left table + matching from right.
• RIGHT JOIN: Returns all rows from right table + matching from left.
• FULL JOIN: Returns all rows when match exists in either table.`
  },
  {
    unitTitle: 'Unit 3: Normalization & Schema Refinement',
    topics: ['Functional Dependencies', '1NF, 2NF, 3NF, BCNF', 'Lossless Join Decomposition'],
    content: `1. Why Normalization?
Minimizes redundancy and prevents insertion, update, and deletion anomalies.

2. Normal Forms Hierarchy:
• 1NF: All attributes contain atomic (indivisible) values. No repeating groups.
• 2NF: In 1NF and no partial dependencies (every non-prime attribute fully functionally dependent on candidate key).
• 3NF: In 2NF and no transitive dependencies (X -> Y where neither X is super key nor Y is prime attribute).
• BCNF: For every non-trivial functional dependency X -> Y, X MUST be a super key.`
  },
  {
    unitTitle: 'Unit 4: Transaction Processing & ACID Properties',
    topics: ['ACID Properties', 'Serializability', 'Two-Phase Locking (2PL)', 'Deadlock Handling'],
    content: `1. ACID Properties:
• Atomicity: All operations in transaction succeed or entire transaction is aborted.
• Consistency: Database remains in valid state satisfying all integrity constraints.
• Isolation: Concurrent transactions do not interfere with each other.
• Durability: Committed updates survive system crashes.

2. Two-Phase Locking (2PL):
• Growing Phase: Locks acquired, none released.
• Shrinking Phase: Locks released, no new locks acquired.
Guarantees serializability.`
  }
];

export const OS_UNITS: ResourceUnit[] = [
  {
    unitTitle: 'Unit 1: Process Management & CPU Scheduling',
    topics: ['Process Control Block (PCB)', 'Context Switching', 'FCFS, SJF, Round Robin Scheduling'],
    content: `1. Process Lifecycle:
States: New -> Ready -> Running -> Waiting -> Terminated.
PCB contains: Process ID, Program Counter, CPU registers, Memory limits, Open files list.

2. CPU Scheduling:
• FCFS: Non-preemptive, suffers from convoy effect.
• SJF: Optimal average waiting time, but needs prediction of burst times.
• Round Robin: Preemptive, uses fixed time quantum (Q). Ideal for time-sharing systems.`
  },
  {
    unitTitle: 'Unit 2: Process Synchronization & Deadlocks',
    topics: ['Critical Section Problem', 'Semaphores & Mutex', '4 Coffman Conditions', 'Banker Algorithm'],
    content: `1. Critical Section Problem:
Requirements: Mutual Exclusion, Progress, Bounded Waiting.

2. Deadlock Conditions (Coffman Conditions):
All 4 must hold simultaneously:
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait

Deadlock Avoidance: Banker's Algorithm dynamically tests resource allocation for safety.`
  },
  {
    unitTitle: 'Unit 3: Memory Management & Virtual Memory',
    topics: ['Paging & Frame Allocation', 'TLB', 'Page Replacement (FIFO, LRU, OPT)', 'Thrashing'],
    content: `1. Paging:
Divides logical memory into Pages and physical memory into Frames of identical size. Eliminates external fragmentation.

2. Page Replacement:
• FIFO: Replace oldest page (may cause Belady's Anomaly).
• LRU: Replace page least recently accessed.
• OPT: Replace page not needed for longest period in future (theoretical limit).`
  }
];

export const getFallbackUnits = (resource: Resource): ResourceUnit[] => {
  const text = `${resource.subject} ${resource.title} ${resource.description}`.toLowerCase();
  
  if (text.includes('data struct') || text.includes('dsa') || text.includes('cs301') || text.includes('algorithm')) {
    return DSA_UNITS;
  }
  if (text.includes('dbms') || text.includes('database') || text.includes('cs304') || text.includes('sql')) {
    return DBMS_UNITS;
  }
  if (text.includes('operating system') || text.includes('os') || text.includes('cs305')) {
    return OS_UNITS;
  }

  // Generic structured units
  return [
    {
      unitTitle: 'Unit 1: Course Overview & Fundamental Concepts',
      topics: ['Introduction', 'Core Definitions', 'Foundational Principles'],
      content: resource.notesContent || resource.description || 'Foundational syllabus concepts and class overview.'
    },
    {
      unitTitle: 'Unit 2: Detailed Topics & Architecture',
      topics: ['Key Mechanisms', 'Standard Workflows', 'Implementation Details'],
      content: `Detailed study material for ${resource.subject}.\n\n• Core Principles and architecture\n• Standard methodologies and implementation\n• Practical examples and diagrams`
    },
    {
      unitTitle: 'Unit 3: Exam Review & Summary',
      topics: ['Important Questions', 'Key Formulas', 'Exam Takeaways'],
      content: `Summary and high-yield revision notes for ${resource.title}.\n\n1. Review all core definitions and key terms.\n2. Practice past semester problems and exercises.\n3. Focus on architecture diagrams and algorithm flows.`
    }
  ];
};

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Data Structures & Algorithms - Complete Notes',
    description: 'Comprehensive 5-Unit lecture notes covering Linear and Non-Linear Data Structures, Asymptotic Analysis, and Algorithms.',
    subject: 'CS301 - Data Structures',
    category: 'DOCUMENT',
    fileUrl: '',
    uploaderName: 'Prof. Sharma (CSE Dept)',
    createdAt: new Date().toISOString(),
    units: DSA_UNITS
  },
  {
    id: 2,
    title: 'Database Management Systems - Study Guide & Lab Notes',
    description: 'Comprehensive study notes on Relational Models, Normalization, SQL Joins, Indexing, and Transaction ACID properties.',
    subject: 'CS304 - DBMS',
    category: 'DOCUMENT',
    fileUrl: '',
    uploaderName: 'Dr. Rao (IT Dept)',
    createdAt: new Date().toISOString(),
    units: DBMS_UNITS
  },
  {
    id: 3,
    title: 'Operating Systems - Core Concepts & Exam Review',
    description: 'Detailed study notes covering Process Lifecycle, CPU Scheduling, Deadlock Detection, Paging, and Virtual Memory.',
    subject: 'CS305 - Operating Systems',
    category: 'DOCUMENT',
    fileUrl: '',
    uploaderName: 'Prof. Anita (CSE Dept)',
    createdAt: new Date().toISOString(),
    units: OS_UNITS
  }
];

const getLocalResources = (): Resource[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  let resources: Resource[] = [];

  if (!data) {
    resources = DEFAULT_RESOURCES;
  } else {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        resources = parsed;
      } else {
        resources = DEFAULT_RESOURCES;
      }
    } catch {
      resources = DEFAULT_RESOURCES;
    }
  }

  // Ensure every resource has populated units!
  let changed = false;
  resources = resources.map(res => {
    if (!res.units || res.units.length === 0 || res.units[0].unitTitle === 'Overview & Study Guide') {
      changed = true;
      return {
        ...res,
        units: getFallbackUnits(res)
      };
    }
    return res;
  });

  if (changed || !data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resources));
  }

  return resources;
};

export const getAllResources = async (): Promise<Resource[]> => {
  try {
    const response = await api.get('/resources');
    if (Array.isArray(response.data) && response.data.length > 0) {
      const localRes = getLocalResources();
      const backendIds = new Set(response.data.map((r: Resource) => r.id));
      const newLocals = localRes.filter(r => !backendIds.has(r.id));
      const combined = [...newLocals, ...response.data];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
      return combined;
    }
  } catch {
    // Backend offline or unauthorized, fallback gracefully
  }
  return getLocalResources();
};

export const createResource = async (data: Partial<Resource>): Promise<Resource> => {
  const current = getLocalResources();
  const baseResource: Resource = {
    id: Date.now(),
    title: data.title || 'Untitled Resource',
    description: data.description || '',
    subject: data.subject || 'General Studies',
    courseName: data.subject || 'General Studies',
    category: data.category || 'DOCUMENT',
    fileUrl: data.fileUrl || '',
    uploaderName: data.uploaderName || 'Faculty Member',
    createdAt: new Date().toISOString(),
    notesContent: data.notesContent || data.description || ''
  };

  const newResource: Resource = {
    ...baseResource,
    units: data.units && data.units.length > 0
      ? data.units
      : data.notesContent
        ? [
            {
              unitTitle: 'Lecture Notes & Study Material',
              topics: ['Faculty Notes', 'Key Concepts'],
              content: data.notesContent
            }
          ]
        : getFallbackUnits(baseResource)
  };

  try {
    const response = await api.post('/resources', data);
    if (response.data && response.data.id) {
      newResource.id = response.data.id;
    }
  } catch (apiError) {
    console.warn('Backend resource upload warning (saved locally):', apiError);
  }

  const updated = [newResource, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event('resourcesUpdated'));

  return newResource;
};
