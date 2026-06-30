# GiveForward

A transparent, mobile-first donation platform for verified causes across Nigeria — mosques, churches, and communities in need — built on Nomba's payment infrastructure for the DevCareer x Nomba Hackathon.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Nomba Checkout API, Virtual Accounts, Webhooks

## Status: Build Phase MVP
- [x] Home feed with featured causes and live totals
- [x] Cause detail page with story, progress, and recent donors
- [x] Donation flow with amount selection and payment method
- [x] Success / receipt screen
- [x] Nomba checkout API route (`/api/nomba/checkout`)
- [x] Nomba webhook listener (`/api/nomba/webhook`)
- [ ] Live Nomba sandbox keys wired in (pending credentials)
- [ ] Persist donations to a database, update progress bars from webhook events
- [ ] Virtual account generation per cause

## Getting started
```bash
npm install
cp .env.local.example .env.local   # add your Nomba sandbox credentials
npm run dev
```

## Project structure
```
app/
  page.tsx                       Home — cause feed
  causes/[id]/page.tsx           Cause detail
  causes/[id]/donate/page.tsx    Donation flow
  causes/[id]/success/page.tsx   Receipt
  api/nomba/checkout/route.ts    Creates a Nomba checkout order
  api/nomba/webhook/route.ts     Receives payment confirmation events
lib/
  data.ts                        Cause and donation data (mock, to be replaced by DB)
  nomba.ts                       Nomba API client
```
