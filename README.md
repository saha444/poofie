# 🛡️ POOFIE

> **Trust Beyond Followers.** An immutable, decentralized digital identity and reputation platform built on Ethereum and IPFS.

Poofie is a Web3 digital credentials and reputation platform designed to solve online identity fragmentation, bot Sybil attacks, and inflated popularity metrics. Instead of rewarding engagement and popularity, Poofie focuses on **credibility, authentic contributions, and professional reputation**.

All user verification badges (Verified Human ✅ & Verified Professional ⭐) are minted as ERC-721 NFTs, and professional attestations are cryptographically signed on-chain to provide a portable, persistent trust layer.

---

## 🌟 Core Pillars of Trust

### 1. Verified Human ✅
- **Purpose**: Sybil-resistant identity linkage.
- **Requirements**: Cryptographic wallet ownership, email validation, and phone verification.
- **Benefits**: Protects the ecosystem from bot networks, allows publishing content, and enables user rating systems.

### 2. Verified Professional ⭐
- **Purpose**: Verifies legitimate expertise or work history.
- **Requirements**:
  - **Credentials**: Verifiable company email, college graduation records, or certifications.
  - **Proof of Work**: Pinned portfolio assets, GitHub repositories, or design links.
  - **Social Proof**: A minimum of 3 peer endorsements from other verified professionals in the community.
- **Benefits**: Multiplies reputation weights, grants access to professional reviews, and increases explore discoverability.

---

## 📊 The Reputation Matrix

Poofie calculates user authority through a single composite metric: **The Poofie Score**.

$$\text{Poofie Score} = \text{Content Score} + \text{Reputation Score}$$

### Content Score
- Measures **what you build/create**.
- Derived from community-wide 1-5 star content ratings on your pinned IPFS projects, publications, or visual showcases.

### Reputation Score
- Measures **how you collaborate**.
- Derived from multi-dimensional peer reviews evaluated across three specific core categories:
  - **Skill**: Professional competence and coding/design expertise.
  - **Trust**: Honesty, integrity, and ethical standard.
  - **Reliability**: Dependency, deadline consistency, and communication.
- Every professional review requires a cryptographically signed written justification.

---

## ⚙️ Under the Hood: Hybrid Web3 Architecture

Poofie uses a hybrid on-chain/off-chain model to optimize transaction speeds and minimize gas consumption:

```
                  ┌────────────────────────────────────────┐
                  │              POOFIE DAPP               │
                  └───────────┬────────────────┬───────────┘
                              │                │
             [ Off-chain IPFS Pinned Data ]    │ [ On-chain EVM Transactions ]
                              │                │
            ┌─────────────────▼──────────┐     │     ┌────────────────────────┐
            │ Media Files, Design Assets │     ├────►│ Wallet Key Signatures  │
            ├────────────────────────────┤     │     ├────────────────────────┤
            │ Post and Project Metadata  │     ├────►│ Human & Prof NFT Mints │
            ├────────────────────────────┤     │     ├────────────────────────┤
            │ Attestation Comment Payload│     └────►│ Score Snapshots & CIDs │
            └────────────────────────────┘           └────────────────────────┘
```

- **On-Chain (Ethereum)**: Wallet registration, NFT verification badge mints, peer endorsement registrations, rating credentials, and IPFS CIDs anchors.
- **Off-Chain (IPFS)**: High-throughput publications, project documents, imagery, media assets, and detailed written review logs.

---

## 🎮 Gamification & XP Progression

To reward active, positive ecosystem participation, Poofie employs a robust gamification dashboard:
- **XP Levels**: Gain 1000 XP through verifications, ratings, and endorsements to rank up. Level milestones unlock NFT badges.
- **Streak multiplier**: Building consecutive daily rating check-ins multiplies XP yields from all Web3 actions.
- **Rating Restrictions**: If a user's Poofie Score falls below **20**, voting and rating privileges are restricted until they recover their score by publishing quality content.

---

## 💻 Local Setup & Development

Poofie is built using **React, Vite, CSS Grid/Flexbox modules, and Lucide React**.

### 1. Installation
Install core packages and SVG icons:
```bash
npm install
```

### 2. Run Locally on Host
Launch the Vite hot-reloading development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 3. Production Bundler Compile
Verify clean builds and tree-shaking compilation:
```bash
npm run build
```

---

## 🔍 Interactive Sandbox Guides

To easily preview and test the complete trust journey, we've included several simulator panels:
1. **Wallet Connector**: Simulates MetaMask connections and personal message signing.
2. **OTP Verifier**: Lets you type any 6-digit code (e.g. `123456`) to instantly verify email/phone.
3. **Endorsement Sandbox**: Click **"Simulate Peer Endorsements"** in the verification panel to instantly receive 3 attestations from community leads (Alice, Marcus, Elena) and satisfy Professional Star requirements.
4. **Low-Score Simulator**: Go to settings and toggle **"Simulate Low Poofie Score"** to see how feed voting panels lock when score authority is compromised.
