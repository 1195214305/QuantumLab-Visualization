# QuantumLab - 量子计算可视化平台

<div align="center">

![QuantumLab Logo](frontend/public/quantum.svg)

**基于阿里云ESA边缘计算的量子计算学习平台**

[![ESA Pages](https://img.shields.io/badge/Powered%20by-阿里云%20ESA-orange)](https://www.aliyun.com/product/esa)
[![MindQuantum](https://img.shields.io/badge/Framework-MindQuantum-blue)](https://www.mindspore.cn/mindquantum)
[![React](https://img.shields.io/badge/Frontend-React%2018-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6)](https://www.typescriptlang.org)

[在线演示](https://quantumlab.8a5362ec.er.aliyun-esa.net) · [功能介绍](#功能特性) · [快速开始](#快速开始)

</div>

## 项目简介

QuantumLab 是一个面向量子计算初学者的交互式学习平台，旨在帮助用户理解量子计算的基本概念、量子门操作和量子算法。平台基于华为 MindQuantum 框架，提供可视化的量子电路构建和模拟功能。

### 核心亮点

- **交互式量子电路构建器**：拖拽式操作，实时模拟量子态演化
- **布洛赫球可视化**：直观展示单量子比特状态
- **MindQuantum作业系统**：IQP、VQE、QPE三大算法的交互式教程
- **AI智能助教**：基于边缘函数的量子计算问答系统
- **边缘计算加速**：利用阿里云ESA实现低延迟模拟

## 功能特性

### 1. 量子门学习
- 9种常用量子门的详细介绍（H、X、Y、Z、S、T、RZ、RY、CNOT）
- 矩阵表示和布洛赫球效果可视化
- MindQuantum代码示例

### 2. 量子电路构建
- 可视化电路编辑器
- 支持1-6量子比特
- 实时状态向量显示
- 自动生成MindQuantum代码

### 3. 量子算法
- IQP编码电路详解
- VQE变分算法原理
- QPE相位估计算法

### 4. 量子实验室
- 完整的量子电路模拟器
- 概率分布可视化
- 布洛赫球状态展示
- 代码导出功能

### 5. MindQuantum作业
- **作业一：IQP编码电路** - 量子特征编码
- **作业二：VQE算法** - 变分量子本征求解
- **作业三：QPE算法** - 量子相位估计
- 每个作业包含学习目标、分步教程和交互式演示

### 6. AI智能助教
- 量子计算概念解答
- MindQuantum代码指导
- 算法原理讲解

## 技术架构

```
QuantumLab/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   │   ├── Layout.tsx   # 布局组件
│   │   │   ├── QuantumGate.tsx  # 量子门组件
│   │   │   ├── BlochSphere.tsx  # 布洛赫球组件
│   │   │   └── QuantumCircuit.tsx
│   │   ├── pages/           # 页面组件
│   │   │   ├── Home.tsx     # 首页
│   │   │   ├── Gates.tsx    # 量子门页面
│   │   │   ├── Circuits.tsx # 量子电路页面
│   │   │   ├── Algorithms.tsx # 算法页面
│   │   │   ├── Lab.tsx      # 实验室页面
│   │   │   ├── Homework.tsx # 作业页面
│   │   │   └── AI.tsx       # AI助教页面
│   │   ├── data/            # 数据定义
│   │   └── store/           # 状态管理
│   └── public/              # 静态资源
├── functions/               # ESA边缘函数
│   ├── ai/
│   │   └── chat.js         # AI问答函数
│   └── simulate.js         # 量子模拟函数
└── README.md
```

### 技术栈

**前端**
- React 18 + TypeScript
- Tailwind CSS（暗色主题）
- Framer Motion（动画）
- Zustand（状态管理）
- React Router（路由）

**边缘计算**
- 阿里云ESA Pages
- Edge Functions（边缘函数）
- 通义千问API（AI问答）

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/quantumlab.git
cd quantumlab

# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## ESA边缘函数

### AI问答函数 (`/api/ai/chat`)

```javascript
// 请求示例
POST /api/ai/chat
{
  "message": "什么是量子叠加态？",
  "history": []
}

// 响应示例
{
  "response": "量子叠加态是...",
  "usage": { "total_tokens": 150 }
}
```

### 量子模拟函数 (`/api/simulate`)

```javascript
// 请求示例
POST /api/simulate
{
  "gates": [
    { "type": "H", "qubit": 0, "column": 0 },
    { "type": "CNOT", "qubit": 1, "control": 0, "column": 1 }
  ],
  "numQubits": 2
}

// 响应示例
{
  "statevector": [...],
  "probabilities": [
    { "state": "00", "probability": 0.5 },
    { "state": "11", "probability": 0.5 }
  ],
  "blochAngles": [...]
}
```

## MindQuantum集成

本项目与华为MindQuantum框架深度集成，所有代码示例均可直接在MindQuantum环境中运行：

```python
# 安装MindQuantum
pip install mindquantum

# 运行示例代码
from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X
from mindquantum.simulator import Simulator

# 创建Bell态
circuit = Circuit()
circuit += H.on(0)
circuit += X.on(1, 0)

# 模拟
sim = Simulator('mqvector', 2)
sim.apply_circuit(circuit)
print(sim.get_qs())
```

## 项目截图

### 首页
展示量子计算核心概念和平台功能导航

### 量子门页面
交互式量子门学习，包含矩阵表示和布洛赫球效果

### 实验室
完整的量子电路构建和模拟环境

### 作业系统
MindQuantum三大作业的交互式教程

## 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 许可证

MIT License

## 致谢

- [阿里云ESA](https://www.aliyun.com/product/esa) - 边缘计算平台
- [MindQuantum](https://www.mindspore.cn/mindquantum) - 量子计算框架
- [React](https://react.dev) - 前端框架
- [Tailwind CSS](https://tailwindcss.com) - CSS框架

---

<div align="center">

**本项目由阿里云ESA提供加速、计算和保护**

Made with ❤️ for Quantum Computing Education

</div>
