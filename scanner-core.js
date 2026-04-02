(function (globalScope) {
    function sampleCircleInkDensity(matrix, centerX, centerY, radius) {
        let total = 0;
        let count = 0;

        for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
            for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
                if ((offsetX * offsetX) + (offsetY * offsetY) > radius * radius) {
                    continue;
                }

                const x = centerX + offsetX;
                const y = centerY + offsetY;

                if (x < 0 || x >= matrix.width || y < 0 || y >= matrix.height) {
                    continue;
                }

                total += matrix.getInkAt(x, y);
                count += 1;
            }
        }

        if (!count) {
            return 0;
        }

        return total / count;
    }

    function sampleAnnulusInkDensity(matrix, centerX, centerY, innerRadius, outerRadius) {
        let total = 0;
        let count = 0;
        const innerRadiusSquared = innerRadius * innerRadius;
        const outerRadiusSquared = outerRadius * outerRadius;

        for (let offsetY = -outerRadius; offsetY <= outerRadius; offsetY += 1) {
            for (let offsetX = -outerRadius; offsetX <= outerRadius; offsetX += 1) {
                const distanceSquared = (offsetX * offsetX) + (offsetY * offsetY);

                if (distanceSquared < innerRadiusSquared || distanceSquared > outerRadiusSquared) {
                    continue;
                }

                const x = centerX + offsetX;
                const y = centerY + offsetY;

                if (x < 0 || x >= matrix.width || y < 0 || y >= matrix.height) {
                    continue;
                }

                total += matrix.getInkAt(x, y);
                count += 1;
            }
        }

        if (!count) {
            return 0;
        }

        return total / count;
    }

    function computeBubbleFillScore(matrix, bubbleX, bubbleY, bubbleRadius) {
        const coreRadius = Math.max(4, Math.round(bubbleRadius * 0.42));
        const haloInnerRadius = Math.max(coreRadius + 3, Math.round(bubbleRadius * 1.08));
        const haloOuterRadius = Math.max(haloInnerRadius + 2, Math.round(bubbleRadius * 1.58));
        const coreInk = sampleCircleInkDensity(matrix, bubbleX, bubbleY, coreRadius);
        const haloInk = sampleAnnulusInkDensity(matrix, bubbleX, bubbleY, haloInnerRadius, haloOuterRadius);

        return Math.max(0, coreInk - (haloInk * 0.35));
    }

    function classifyBubbleScores(scores) {
        const rankedScores = scores
            .map((value, index) => ({ value, index }))
            .sort((first, second) => second.value - first.value);
        const orderedScores = [...scores].sort((first, second) => first - second);
        const baselineSlice = orderedScores.slice(0, Math.min(3, orderedScores.length));
        const baseline = baselineSlice.reduce((sum, value) => sum + value, 0) / Math.max(baselineSlice.length, 1);
        const best = rankedScores[0];
        const next = rankedScores[1] ?? { value: 0 };
        const bestAdjusted = best.value - baseline;
        const nextAdjusted = next.value - baseline;

        if (bestAdjusted < 0.16) {
            return null;
        }

        if (nextAdjusted >= 0.12 && (nextAdjusted / Math.max(bestAdjusted, 0.0001)) >= 0.72) {
            return "MULTI";
        }

        return best.index;
    }

    function readAnswersFromBinaryMatrix(matrix, layout, choices) {
        return layout.questions.map((question) => {
            const scores = question.bubbles.map((bubble) => {
                return computeBubbleFillScore(matrix, Math.round(bubble.x), Math.round(bubble.y), layout.bubbleRadius);
            });
            const classification = classifyBubbleScores(scores);

            if (classification === null || classification === "MULTI") {
                return classification;
            }

            return choices[classification];
        });
    }

    const api = {
        sampleCircleInkDensity,
        sampleAnnulusInkDensity,
        computeBubbleFillScore,
        classifyBubbleScores,
        readAnswersFromBinaryMatrix
    };

    globalScope.ScannerCore = api;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : window));
