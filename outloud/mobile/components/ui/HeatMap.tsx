import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { HeatmapSegment } from '@/services/types';
import { colors, typography } from '@/styles/neumorphic';

interface HeatmapProps {
  segments: HeatmapSegment[];
}

const verdictColors = {
  strong: {
    bg: 'rgba(78, 205, 196, 0.15)',
    border: 'rgba(78, 205, 196, 0.4)',
    text: '#4ECDC4',
  },
  vague: {
    bg: 'rgba(255, 230, 109, 0.15)',
    border: 'rgba(255, 230, 109, 0.4)',
    text: '#FFE66D',
  },
  misconception: {
    bg: 'rgba(255, 107, 107, 0.15)',
    border: 'rgba(255, 107, 107, 0.4)',
    text: '#FF6B6B',
  },
};

const verdictLabels = {
  strong: 'Strong',
  vague: 'Vague',
  misconception: 'Needs Work',
};

export default function Heatmap({ segments }: HeatmapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Explanation Breakdown</Text>
      
      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(verdictLabels).map(([verdict, label]) => (
          <View key={verdict} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: verdictColors[verdict as keyof typeof verdictColors].text },
              ]}
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Heatmap segments */}
      <ScrollView
        style={styles.segmentsContainer}
        showsVerticalScrollIndicator={false}
      >
        {segments.map((segment, index) => {
          const colorScheme = verdictColors[segment.verdict];
          
          return (
            <View key={index} style={styles.segmentWrapper}>
              <View
                style={[
                  styles.segment,
                  {
                    backgroundColor: colorScheme.bg,
                    borderColor: colorScheme.border,
                  },
                ]}
              >
                <Text style={[styles.segmentText, { color: colors.text }]}>
                  {segment.text}
                </Text>
                
                {segment.note && (
                  <View style={styles.noteContainer}>
                    <View style={[styles.noteDot, { backgroundColor: colorScheme.text }]} />
                    <Text style={styles.noteText}>{segment.note}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    fontSize: 20,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  segmentsContainer: {
    flex: 1,
  },
  segmentWrapper: {
    marginBottom: 12,
  },
  segment: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  segmentText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 7,
  },
  noteText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});