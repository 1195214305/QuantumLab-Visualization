// 量子门数据
export const quantumGates = {
  H: {
    name: 'Hadamard门',
    symbol: 'H',
    description: '将量子比特置于叠加态，是量子计算中最基础的门之一',
    matrix: [
      ['1/√2', '1/√2'],
      ['1/√2', '-1/√2']
    ],
    effect: '|0⟩ → (|0⟩ + |1⟩)/√2\n|1⟩ → (|0⟩ - |1⟩)/√2',
    blochEffect: '绕X+Z轴旋转π',
    color: 'emerald'
  },
  X: {
    name: 'Pauli-X门',
    symbol: 'X',
    description: '量子NOT门，翻转量子比特的状态',
    matrix: [
      ['0', '1'],
      ['1', '0']
    ],
    effect: '|0⟩ → |1⟩\n|1⟩ → |0⟩',
    blochEffect: '绕X轴旋转π',
    color: 'rose'
  },
  Y: {
    name: 'Pauli-Y门',
    symbol: 'Y',
    description: '绕Y轴旋转π的量子门',
    matrix: [
      ['0', '-i'],
      ['i', '0']
    ],
    effect: '|0⟩ → i|1⟩\n|1⟩ → -i|0⟩',
    blochEffect: '绕Y轴旋转π',
    color: 'amber'
  },
  Z: {
    name: 'Pauli-Z门',
    symbol: 'Z',
    description: '相位翻转门，改变|1⟩态的相位',
    matrix: [
      ['1', '0'],
      ['0', '-1']
    ],
    effect: '|0⟩ → |0⟩\n|1⟩ → -|1⟩',
    blochEffect: '绕Z轴旋转π',
    color: 'sky'
  },
  RZ: {
    name: 'RZ旋转门',
    symbol: 'RZ',
    description: '绕Z轴旋转任意角度θ的参数化量子门',
    matrix: [
      ['e^(-iθ/2)', '0'],
      ['0', 'e^(iθ/2)']
    ],
    effect: '|0⟩ → e^(-iθ/2)|0⟩\n|1⟩ → e^(iθ/2)|1⟩',
    blochEffect: '绕Z轴旋转θ',
    color: 'violet'
  },
  RY: {
    name: 'RY旋转门',
    symbol: 'RY',
    description: '绕Y轴旋转任意角度θ的参数化量子门',
    matrix: [
      ['cos(θ/2)', '-sin(θ/2)'],
      ['sin(θ/2)', 'cos(θ/2)']
    ],
    effect: '改变|0⟩和|1⟩的振幅比例',
    blochEffect: '绕Y轴旋转θ',
    color: 'orange'
  },
  CNOT: {
    name: 'CNOT门',
    symbol: 'CNOT',
    description: '受控NOT门，当控制比特为|1⟩时翻转目标比特',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
      ['0', '0', '1', '0']
    ],
    effect: '|00⟩ → |00⟩\n|01⟩ → |01⟩\n|10⟩ → |11⟩\n|11⟩ → |10⟩',
    blochEffect: '创建量子纠缠',
    color: 'cyan'
  },
  S: {
    name: 'S门',
    symbol: 'S',
    description: '相位门，等价于RZ(π/2)',
    matrix: [
      ['1', '0'],
      ['0', 'i']
    ],
    effect: '|0⟩ → |0⟩\n|1⟩ → i|1⟩',
    blochEffect: '绕Z轴旋转π/2',
    color: 'pink'
  },
  T: {
    name: 'T门',
    symbol: 'T',
    description: 'π/8门，等价于RZ(π/4)',
    matrix: [
      ['1', '0'],
      ['0', 'e^(iπ/4)']
    ],
    effect: '|0⟩ → |0⟩\n|1⟩ → e^(iπ/4)|1⟩',
    blochEffect: '绕Z轴旋转π/4',
    color: 'teal'
  }
}

// 量子算法数据
export const quantumAlgorithms = {
  iqp: {
    name: 'IQP编码',
    fullName: 'Instantaneous Quantum Polynomial',
    description: '一种量子机器学习中的数据编码方式，将经典数据编码到量子态中',
    steps: [
      '对所有量子比特应用Hadamard门，创建均匀叠加态',
      '应用RZ门编码单比特特征',
      '应用CNOT门创建量子纠缠',
      '应用RZ门编码双比特交互特征'
    ],
    applications: ['量子机器学习', '量子特征映射', '量子核方法'],
    complexity: 'O(n²) 门操作'
  },
  vqe: {
    name: 'VQE算法',
    fullName: 'Variational Quantum Eigensolver',
    description: '变分量子本征求解器，用于求解分子基态能量',
    steps: [
      '准备参数化量子电路（Ansatz）',
      '测量哈密顿量期望值',
      '使用经典优化器更新参数',
      '重复直到收敛'
    ],
    applications: ['量子化学', '分子模拟', '材料科学'],
    complexity: '混合量子-经典算法'
  },
  qpe: {
    name: 'QPE算法',
    fullName: 'Quantum Phase Estimation',
    description: '量子相位估计，用于估计酉算子的本征值相位',
    steps: [
      '准备辅助量子比特的叠加态',
      '应用受控酉操作',
      '应用逆量子傅里叶变换',
      '测量获得相位估计'
    ],
    applications: ['Shor算法', '量子化学', '量子模拟'],
    complexity: 'O(n²) 门操作'
  }
}

// IQP电路配置
export const iqpCircuitConfig = {
  qubits: 4,
  features: ['α₀', 'α₁', 'α₂', 'α₃'],
  interactions: [
    { qubits: [0, 1], feature: 'α₄' },
    { qubits: [1, 2], feature: 'α₅' },
    { qubits: [2, 3], feature: 'α₆' }
  ]
}

// VQE Ansatz配置
export const vqeAnsatzConfig = {
  qubits: 4,
  layers: 2,
  gatesPerLayer: ['RY', 'RZ', 'CNOT']
}

// QPE配置
export const qpeConfig = {
  auxiliaryQubits: 3,
  targetQubits: 1,
  precision: 3
}
