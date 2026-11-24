//go:build js && wasm

package main

import (
	"math"
	"syscall/js"
)

const (
	muEarthKm3S2 = 398600.4418 // Earth standard gravitational parameter (km^3/s^2)
	earthRadius  = 6371.0      // Mean Earth radius (km)
)

// solveKepler solves M = E - e*sin(E) using Newton-Raphson iteration.
func solveKepler(meanAnomaly, eccentricity float64) float64 {
	E := meanAnomaly
	for i := 0; i < 8; i++ {
		f := E - eccentricity*math.Sin(E) - meanAnomaly
		fPrime := 1.0 - eccentricity*math.Cos(E)
		delta := f / fPrime
		E -= delta
		if math.Abs(delta) < 1e-9 {
			break
		}
	}
	return E
}

func computeState(_ js.Value, args []js.Value) any {
	if len(args) < 4 {
		return nil
	}
	semiMajorKm := args[0].Float()
	ecc := args[1].Float()
	inclinationDeg := args[2].Float()
	elapsedSec := args[3].Float()

	if semiMajorKm <= earthRadius+100 {
		semiMajorKm = earthRadius + 408.0
	}

	// Orbital period T = 2*pi*sqrt(a^3 / mu)
	periodSec := 2.0 * math.Pi * math.Sqrt(math.Pow(semiMajorKm, 3)/muEarthKm3S2)
	meanMotion := (2.0 * math.Pi) / periodSec
	meanAnomaly := math.Mod(meanMotion*elapsedSec, 2.0*math.Pi)
	if meanAnomaly < 0 {
		meanAnomaly += 2.0 * math.Pi
	}

	E := solveKepler(meanAnomaly, ecc)
	sinE, cosE := math.Sin(E), math.Cos(E)
	sqrtOneMinusE2 := math.Sqrt(1.0 - ecc*ecc)

	// True anomaly nu
	trueAnomaly := math.Atan2(sqrtOneMinusE2*sinE, cosE-ecc)
	radiusKm := semiMajorKm * (1.0 - ecc*cosE)
	altitudeKm := radiusKm - earthRadius

	// Vis-viva equation v = sqrt(mu * (2/r - 1/a))
	velocityKmS := math.Sqrt(muEarthKm3S2 * (2.0/radiusKm - 1.0/semiMajorKm))

	// Ground track approximation with Earth rotation
	incRad := inclinationDeg * math.Pi / 180.0
	latRad := math.Asin(math.Sin(incRad) * math.Sin(trueAnomaly))
	lonRad := math.Atan2(math.Cos(incRad)*math.Sin(trueAnomaly), math.Cos(trueAnomaly)) - (elapsedSec * 7.2921159e-5)
	lonDeg := math.Mod((lonRad*180.0/math.Pi)+540.0, 360.0) - 180.0
	latDeg := latRad * 180.0 / math.Pi

	return map[string]any{
		"altitudeKm":   altitudeKm,
		"velocityKmS":  velocityKmS,
		"periodMin":    periodSec / 60.0,
		"trueAnomaly":  trueAnomaly,
		"latDeg":       latDeg,
		"lonDeg":       lonDeg,
		"apogeeKm":     semiMajorKm*(1.0+ecc) - earthRadius,
		"perigeeKm":    semiMajorKm*(1.0-ecc) - earthRadius,
	}
}

func main() {
	done := make(chan struct{})
	js.Global().Set("solarisSolveOrbit", js.FuncOf(computeState))
	js.Global().Set("solarisWasmReady", js.ValueOf(true))
	<-done
}
