import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Scores } from '@/services/types';
import { colors, typography } from '@/styles/neumorphic';

interface ScoreCardProps {
  scores: Scores;
}

const scoreInfo = {
  coverage: { label: 'Coverage', description: 'Key concepts mentioned' },
  clarity: { label: 'Clarity', description: 'Clear & well-structured' },
  correctness: { label: 'Correctness', description: 'Factually accurate' },
  causality: { label: 'Causality', description: 'Explains why & how' },
};

function getScoreColor(score: number): string {
  if (score >= 80) return '#4ECDC4'; // Strong - Turquoise
  if (score >= 60) return '#FFE66D'; // Good - Yellow
  return '#FF6B6B'; // Needs work - Coral
}

function ScoreBar({ score }: { score: number }) {
  const color = getScoreColor(score);
  
  return (
    <View style={styles.scoreBarContainer}>
      <View style={styles.scoreBarBackground}>
        <View
          style={[
            styles.scoreBarFill,
            {
              width: `${score}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={[styles.scoreValue, { color }]}>
        {Math.round(score)}
      </Text>
    </View>
  );
}

export default function ScoreCard({ scores }: ScoreCardProps) {
  const averageScore = Math.round(
    (scores.coverage + scores.clarity + scores.correctness + scores.causality) / 4
  );

  return (
    <View style={styles.container}>
      {/* Overall Score */}
      <View style={styles.overallScore}>
        <Text style={styles.overallLabel}>Overall Score</Text>
        <Text style={[styles.overallValue, { color: getScoreColor(averageScore) }]}>
          {averageScore}
        </Text>
      </View>

      {/* Individual Scores */}
      <View style={styles.scoresGrid}>
        {Object.entries(scores).map(([key, value]) => {
          const info = scoreInfo[key as keyof Scores];
          return (
            <View key={key} style={styles.scoreItem}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreLabel}>{info.label}</Text>
                <Text style={styles.scoreDescription}>{info.description}</Text>
              </View>
              <ScoreBar score={value} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  overallScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  overallLabel: {
    ...typography.h3,
    fontSize: 20,
  },
  overallValue: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '700',
  },
  scoresGrid: {
    gap: 20,
  },
  scoreItem: {
    gap: 10,
  },
  scoreHeader: {
    gap: 2,
  },
  scoreLabel: {
    ...typography.label,
    fontSize: 13,
  },
  scoreDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    ...typography.label,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },
});