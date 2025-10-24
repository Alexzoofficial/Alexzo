# Verification Codes Configuration

## ⚠️ IMPORTANT - KABHI DELETE NA KAREIN!

Is folder mein `verification-codes.ts` file hai jo **bahut important** hai.

## Purpose / Uddeshya

Ye file website ke verification codes store karti hai jaise:
- Google Search Console verification
- Bing Webmaster Tools verification
- Yandex verification
- Pinterest verification
- Aur dusre services ke verification codes

## Usage / Istemal

### Naya Google Verification Code Add Karne Ke Liye:

1. Open karein: `lib/verification-codes.ts`
2. `google` array mein naya code add karein:
   ```typescript
   google: [
     "existing-code-1",
     "existing-code-2",
     "your-new-code-here"  // Yahaan add karein
   ]
   ```

### Other Services Ke Liye:

```typescript
// Example:
bing: "your-bing-verification-code",
yandex: "your-yandex-verification-code",
```

## Current Verification Codes

### Google Search Console:
- ✅ `google7cb025440a4403af` (Original)
- ✅ `LciVAzACk6a_cqUyi_rfYQqgsrX5AUuiWbsCLg5mOs0` (New - Added on Oct 24, 2025)

## Safety Guidelines / Suraksha Nirdesh

1. ❌ **Kabhi is file ko delete na karein**
2. ✅ New codes ko hamesha array mein add karein
3. ✅ Purane codes ko mat hataayein jab tak zarurat na ho
4. ✅ Har code ke saath comment add karein (optional but helpful)

## File Location
```
lib/
  ├── verification-codes.ts  ← Main file (IMPORTANT!)
  └── VERIFICATION-README.md ← This file
```

## Integration with Layout

Ye codes automatically `app/layout.tsx` mein use hote hain. Koi manual change ki zarurat nahi.

---

**Note:** Agar aapko koi doubt ho toh pehle is README ko padhein ya developer se consult karein.
